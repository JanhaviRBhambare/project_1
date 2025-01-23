from flask import Flask, request, jsonify
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_chroma import Chroma
from langchain_ibm import WatsonxEmbeddings
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods
from langchain_ibm import WatsonxLLM
from langchain.chains import RetrievalQA
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])  # Adjust based on your frontend's URL


# Watsonx credentials
CREDENTIALS = Credentials(
    url="https://us-south.ml.cloud.ibm.com",
    api_key="0elfq1NiZ8ji4fb_UU6hpwZHpNLCttqCVoleby-fh2Sl",
)
PROJECT_ID = os.environ.get("PROJECT_ID", "7d48d431-5b51-4db7-9439-1d9b722d6fe8")

# Initialize Watsonx API client
api_client = APIClient(credentials=CREDENTIALS, project_id=PROJECT_ID)

# Initialize Watsonx embeddings
EMBEDDINGS = WatsonxEmbeddings(
    model_id="ibm/slate-30m-english-rtrvr",
    url=CREDENTIALS.url,
    apikey=CREDENTIALS.api_key,
    project_id=PROJECT_ID,
)

# Sample text for processing
TEXT_DATA = """
Symptoms of Anemia:

Fatigue or tiredness
Weakness or feeling faint
Shortness of breath or dizziness
Pale skin, including the inside of the lower eyelids
Cold hands and feet
Chest pain or a rapid heartbeat (in severe cases)
Headaches or lightheadedness
Difficulty concentrating
Causes of Anemia:

Iron deficiency: The most common cause, where the body lacks enough iron to produce hemoglobin.
Vitamin B12 deficiency: Results in reduced red blood cell production, leading to anemia.
Folic acid deficiency: Inadequate folate can also cause a decrease in red blood cell production.
Chronic diseases: Conditions like chronic kidney disease, cancer, or inflammatory disorders (e.g., rheumatoid arthritis) can lead to anemia.
Blood loss: This can result from heavy menstrual periods, gastrointestinal conditions like ulcers or hemorrhoids, or surgery.
Genetic conditions: Such as sickle cell disease or thalassemia.
Bone marrow problems: Such as aplastic anemia, where the bone marrow fails to produce sufficient red blood cells.
Effects of Anemia:

Reduced oxygen supply to tissues, leading to exhaustion and weakness.
Decreased ability to concentrate or focus due to reduced oxygen levels in the brain.
Increased risk of infections, as anemia affects the immune system.
Complications in pregnancy, including premature birth or low birth weight.
Cardiovascular issues such as arrhythmias or even heart failure in severe cases.
Growth and developmental delays in children.
Reduced exercise capacity and endurance due to lower oxygen levels in the body.
Preventive Measures:

Iron supplementation: To prevent or treat iron-deficiency anemia.
Vitamin B12 and folate supplementation: To ensure adequate levels of these nutrients, especially in individuals with dietary restrictions or absorption issues.
Regular blood tests: To monitor iron levels, hemoglobin, and overall health.
Manage chronic diseases: Such as kidney disease or inflammatory disorders to prevent anemia.
Avoid excessive blood loss: Through proper management of menstrual cycles or prompt treatment of gastrointestinal conditions.
Balanced diet: Ensuring a diet rich in essential vitamins and minerals, especially iron and B vitamins.
Early diagnosis: Regular screenings and check-ups to detect anemia early and avoid complications.
Diet for Anemia:

Iron-rich foods:

Red meat (beef, lamb, pork)
Poultry (chicken, turkey)
Seafood (fish, shellfish)
Lentils, beans, chickpeas
Tofu, tempeh
Dark leafy greens (spinach, kale)
Fortified cereals
Dried fruits (raisins, apricots)
Pumpkin seeds, sesame seeds
Vitamin C sources (to enhance iron absorption):

Citrus fruits (oranges, lemons, grapefruits)
Berries (strawberries, blueberries)
Tomatoes
Bell peppers
Broccoli
Vitamin B12-rich foods:

Eggs
Dairy products (milk, cheese, yogurt)
Fortified cereals and plant-based milk
Folate (Vitamin B9) sources:

Leafy green vegetables (spinach, kale)
Beans and legumes
Avocados
Asparagus
Fortified grains and cereals
Foods to Avoid:

Excessive consumption of coffee or tea (as they can inhibit iron absorption).
High-calcium foods, if consumed in excess at the same time as iron-rich foods (calcium can reduce iron absorption).
Processed foods, which can be low in essential nutrients.
"""

@app.route('/ask', methods=['POST'])
def query():
    try:
        # Extract query from the POST request
        query = request.json.get("question")
        query = query +" it is related to anemia"
        if not query:
            return jsonify({"error": "Query is required"}), 400

        # Split the text into smaller chunks for vectorization
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=512,
            chunk_overlap=0,
            length_function=len,
        )
        texts = text_splitter.split_text(TEXT_DATA)

        # Convert the text chunks into Document objects
        documents = [Document(page_content=text) for text in texts]

        # Create a vector store using Chroma
        docsearch = Chroma.from_documents(documents, EMBEDDINGS)

        # Define model type and parameters for Watsonx Granite model
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
            url=CREDENTIALS.url,
            apikey=CREDENTIALS.api_key,
            project_id=PROJECT_ID,
            params=parameters
        )

        # Build RetrievalQA using the vector store and Granite model
        qa = RetrievalQA.from_chain_type(llm=watsonx_granite, chain_type="stuff", retriever=docsearch.as_retriever())

        # Process query and get response
        result = qa.invoke(query)
        response = result['result']

        return jsonify({"question": query, "answer": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)