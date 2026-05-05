import joblib
from app.transformers import HourExtractorTransformer
import pandas as pd
import numpy as np


pipeline = joblib.load("app/models/xgboost_pipeline_VVV.joblib")


