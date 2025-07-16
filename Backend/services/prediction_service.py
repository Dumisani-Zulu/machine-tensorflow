# backend/services/prediction_service.py

from ml.utils import load_ml_artifacts, preprocess_input_data
import pandas as pd # Import pandas here as well for data handling

# Load artifacts once when this module is imported
# This ensures the model and scaler are ready before the first request
model, scaler = load_ml_artifacts()

def get_prediction(raw_input_data: dict) -> dict:
    try:
        # Convert the incoming data (which might be a list of dicts for windowing) to a DataFrame
        # Ensure it handles single dict or list of dicts correctly
        if isinstance(raw_input_data, dict):
            # If a single data point is sent, wrap it in a list for DataFrame creation
            # This will likely lead to issues with rolling features (NaNa) unless your model doesn't use them
            input_df = pd.DataFrame([raw_input_data])
        elif isinstance(raw_input_data, list):
            input_df = pd.DataFrame(raw_input_data)
        else:
            raise ValueError("Input data must be a dictionary or a list of dictionaries.")


        # Preprocess the input data
        # This function handles feature engineering and scaling
        processed_data_for_prediction = preprocess_input_data(input_df)

        # Make prediction. Predict on the *last* row of the processed data,
        # as that represents the most current reading's features.
        # Ensure it's reshaped for single sample prediction: (1, -1)
        single_sample_for_prediction = processed_data_for_prediction[-1].reshape(1, -1)

        prediction_label = model.predict(single_sample_for_prediction)[0]
        prediction_proba = model.predict_proba(single_sample_for_prediction)[0].tolist() # Convert numpy array to list

        return {
            "prediction": int(prediction_label), # Convert numpy int to Python int
            "probability_no_failure": prediction_proba[0],
            "probability_failure": prediction_proba[1]
        }
    except ValueError as ve:
        # Catch specific data processing errors
        print(f"Data processing error: {ve}")
        raise ValueError(f"Invalid input data for prediction: {ve}")
    except Exception as e:
        # Catch any other unexpected errors
        print(f"Error during prediction: {e}")
        raise RuntimeError(f"An error occurred during prediction: {e}")