from transformers import pipeline
from langchain_community.llms import HuggingFacePipeline

def get_llm():
    pipe = pipeline(
        task="text-generation",
        model="google/flan-t5-small",   
        max_new_tokens=256
    )
    return HuggingFacePipeline(pipeline=pipe)