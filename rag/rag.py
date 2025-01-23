import os
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS

from ibm_watsonx_ai import Credentials
from langchain_chroma import Chroma
from langchain_ibm import WatsonxEmbeddings, WatsonxLLM
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods

import traceback
import logging

logging.basicConfig(level=logging.DEBUG)
def initialize_rag_system():
    try:
        # Credentials setup
        credentials = Credentials(
            url="https://us-south.ml.cloud.ibm.com",
            api_key="0elfq1NiZ8ji4fb_UU6hpwZHpNLCttqCVoleby-fh2Sl",
        )
        project_id = os.environ.get("PROJECT_ID", "7d48d431-5b51-4db7-9439-1d9b722d6fe8")

        print("Credentials initialized")
        
        # Embeddings
        try:
            embeddings = WatsonxEmbeddings(
                model_id="ibm/slate-30m-english-rtrvr",
                url=credentials["url"],
                apikey=credentials["apikey"],
                project_id=project_id
            )
            print("Embeddings initialized")
        except Exception as e:
            print(f"Embeddings initialization error: {e}")
            raise

        # Vector Store
        try:
            default_docs = [
                Document(page_content="Anemia is a condition where you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues."),
            ]
            docsearch = Chroma.from_documents(default_docs, embeddings)
            print("Vector store initialized")
        except Exception as e:
            print(f"Vector store initialization error: {e}")
            raise

        # LLM
        try:
            watsonx_granite = WatsonxLLM(
                model_id=ModelTypes.GRANITE_13B_CHAT_V2.value,
                url=credentials.get("url"),
                apikey=credentials.get("apikey"),
                project_id=project_id,
                params={
                    GenParams.DECODING_METHOD: DecodingMethods.SAMPLE,
                    GenParams.MIN_NEW_TOKENS: 1,
                    GenParams.MAX_NEW_TOKENS: 300,
                }
            )
            print("LLM initialized")
        except Exception as e:
            print(f"LLM initialization error: {e}")
            raise

        # QA Chain
        try:
            qa = RetrievalQA.from_chain_type(
                llm=watsonx_granite, 
                chain_type="stuff", 
                retriever=docsearch.as_retriever()
            )
            print("QA system initialized")
            return qa
        except Exception as e:
            print(f"QA system initialization error: {e}")
            raise

    except Exception as e:
        print(f"Overall initialization error: {e}")
        traceback.print_exc()
        raise
# Rest of the code remains the same

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    # Initialize QA system
    qa = initialize_rag_system()

    @app.route('/ask', methods=['POST'])
    def ask_question():
        try:
            # Get JSON data from request body
            data = request.get_json()

            if not data or 'question' not in data:
                return jsonify({"error": "No question provided in request body"}), 400
            
            question = data['question']

            # Append anemia context
            augmented_question = question + " (Consider this in the context of anemia, provide a concise answer)"
            
            # Get response from QA system
            response = qa.run(augmented_question)
            
            return jsonify({
                "question": question,
                "answer": response.strip()
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000, debug=True)