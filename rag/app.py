from flask import Flask, request, jsonify
import PyPDF2
import os

app = Flask(__name__)



# rag all code 
import os
import getpass

from ibm_watsonx_ai import Credentials

credentials = Credentials(
    url="https://us-south.ml.cloud.ibm.com",
    api_key="7MS6j4G8SyYwmlEqOZ7aPlbiW5gur2qkPJ4WSgcOyQ2z",
)

try:
    project_id = os.environ["PROJECT_ID"]
except KeyError:
    project_id = "e4dd8e79-8cf6-4cca-a61c-c98484a11313"



import PyPDF2

def process_pdf_by_path(pdf_path):
    try:
        # Open the PDF file
        with open(pdf_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""  # Safeguard against None
            print(f"Content from {pdf_path}:\n{text}")
    except FileNotFoundError:
        print(f"Error: File '{pdf_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Specify the PDF file path
pdf_path = "data.pdf"  # Change this to your desired PDF file path
process_pdf_by_path(pdf_path)

import PyPDF2

def process_pdf_file(file_path):
    """
    Process the PDF file located at the given file path.
    
    Args:
        file_path (str): Path to the PDF file to be processed.
    
    Returns:
        str: Extracted text from the PDF.
    """
    try:
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""  # Safeguard against None
        return text
    except FileNotFoundError:
        raise ValueError(f"Error: File '{file_path}' not found.")
    except Exception as e:
        raise ValueError(f"An error occurred while processing the file: {e}")

# Specify the file path to the PDF
pdf_file_path = "data.pdf"  # Replace with your desired file path

# Process the file
try:
    data = process_pdf_file(pdf_file_path)
    print(f"File processed successfully: {len(data)} characters extracted.")
except ValueError as ve:
    print(ve)



from langchain.text_splitter import CharacterTextSplitter

# Split the text into smaller chunks for vectorization
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_text(data)
print(f"Text split into {len(texts)} chunks.")



# !pip install -U "langchain_chroma>=0.1,<0.2"
from langchain_chroma import Chroma
from langchain_ibm import WatsonxEmbeddings
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Initialize Watsonx embeddings
embeddings = WatsonxEmbeddings(
    model_id="ibm/slate-30m-english-rtrvr",
    url=credentials["url"],
    apikey=credentials["apikey"],
    project_id=project_id
)

# Use RecursiveCharacterTextSplitter for better handling of long text
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,  # Set chunk size considering the model's max sequence length
    chunk_overlap=0,
    length_function=len,  # Use len to count characters
)
texts = text_splitter.split_text(data)

# Convert the text chunks into Document objects
documents = [Document(page_content=text) for text in texts]

# Create a vector store for document retrieval
docsearch = Chroma.from_documents(documents, embeddings)
print("Embeddings generated and stored in Chroma.")


from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods
from langchain_ibm import WatsonxLLM

# Define model type and parameters
model_id = ModelTypes.GRANITE_13B_CHAT_V2
parameters = {
    GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
    GenParams.MIN_NEW_TOKENS: 1,
    GenParams.MAX_NEW_TOKENS: 100,
    GenParams.STOP_SEQUENCES: ["<|endoftext|>"]
}

# Initialize the Granite model
watsonx_granite = WatsonxLLM(
    model_id=model_id.value,
    url=credentials.get("url"),
    apikey=credentials.get("apikey"),
    project_id=project_id,
    params=parameters
)
print("Watsonx Granite model initialized.")


from langchain.chains import RetrievalQA

# Build RetrievalQA using the vector store and Granite model
qa = RetrievalQA.from_chain_type(llm=watsonx_granite, chain_type="stuff", retriever=docsearch.as_retriever())
print("Question answering system initialized.")

# Example query




#rag code end

@app.route('/get_ans', methods=['GET'])
def process_pdf():


    query_params = request.args

    # Example: Retrieve a specific query parameter
    param1 = query_params.get('question')  
    
    response = qa.run(param1)
    print(f"Answer: {response}")


  

if __name__ == '__main__':
    app.run(port=5000, debug=True)

