from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.faiss import FaissVectorStore
import faiss

def build_index():
    docs = SimpleDirectoryReader("data/").load_data()

    dimension = 384
    faiss_index = faiss.IndexFlatL2(dimension)

    vector_store = FaissVectorStore(faiss_index)
    index = VectorStoreIndex.from_documents(docs, vector_store=vector_store)

    return index