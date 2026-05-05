from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
import numpy as np


class HourExtractorTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, time_col='Timestamp'):
        self.time_col = time_col

    def fit(self, X, y=None):
        # No state to learn for extracting hours
        return self
    def get_feature_names_out(self, input_features=None):
        return np.array(['hour'])

    def transform(self, X):
        # Create a copy to avoid modifying the original dataframe
        X_transformed = X.copy()

        # Convert to datetime (handles string input)
        # We use pd.to_datetime which is robust for various string formats
        dt_series = pd.to_datetime(X_transformed[self.time_col], errors='coerce')

        # Extract the hour and return as a 2D array (required by sklearn)
        return dt_series.dt.hour.values.reshape(-1, 1)
    

    
