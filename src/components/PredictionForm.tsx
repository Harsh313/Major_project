import React, { useState, FormEvent } from 'react';
import FormSection from './FormSection';
import { samplePatient1, samplePatient2 } from '../data/sampleData';
import { Activity, User, Heart, Brain, Thermometer, Dumbbell } from 'lucide-react';

interface FormState {
  [key: string]: number;
}

const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({});
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };

  const fillSampleData = (sampleNumber: number) => {
    setFormData(sampleNumber === 1 ? samplePatient1 : samplePatient2);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection 
          title="Demographics" 
          icon={<User className="w-5 h-5 text-blue-600" />}
          fields={[
            { name: "Age", label: "Age", type: "number", min: 0, max: 120 },
            { name: "Gender", label: "Gender", type: "select", options: [
              { value: 0, label: "Female" },
              { value: 1, label: "Male" }
            ] },
            { name: "Ethnicity", label: "Ethnicity", type: "select", options: [
              { value: 0, label: "Caucasian" },
              { value: 1, label: "African American" },
              { value: 2, label: "Hispanic" },
              { value: 3, label: "Asian" },
              { value: 4, label: "Other" }
            ] },
            { name: "EducationLevel", label: "Education Level", type: "select", options: [
              { value: 0, label: "Less than High School" },
              { value: 1, label: "High School" },
              { value: 2, label: "Some College" },
              { value: 3, label: "College Degree" },
              { value: 4, label: "Graduate Degree" }
            ] }
          ]}
          formData={formData}
          onChange={handleInputChange}
        />

        <FormSection 
          title="Lifestyle Factors" 
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          fields={[
            { name: "BMI", label: "BMI", type: "number", step: "0.01", min: 10, max: 50 },
            { name: "Smoking", label: "Smoking", type: "select", options: [
              { value: 0, label: "Non-smoker" },
              { value: 1, label: "Smoker" }
            ] },
            { name: "AlcoholConsumption", label: "Alcohol Consumption (drinks/week)", type: "number", step: "0.01", min: 0 },
            { name: "PhysicalActivity", label: "Physical Activity (hours/week)", type: "number", step: "0.01", min: 0 },
            { name: "DietQuality", label: "Diet Quality (scale 1-10)", type: "number", step: "0.01", min: 1, max: 10 },
            { name: "SleepQuality", label: "Sleep Quality (scale 1-10)", type: "number", step: "0.01", min: 1, max: 10 }
          ]}
          formData={formData}
          onChange={handleInputChange}
        />

        <FormSection 
          title="Medical History" 
          icon={<Thermometer className="w-5 h-5 text-blue-600" />}
          fields={[
            { name: "FamilyHistoryAlzheimers", label: "Family History of Alzheimer's", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "CardiovascularDisease", label: "Cardiovascular Disease", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "Diabetes", label: "Diabetes", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "Depression", label: "Depression", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "HeadInjury", label: "History of Head Injury", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "Hypertension", label: "Hypertension", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] }
          ]}
          formData={formData}
          onChange={handleInputChange}
        />

        <FormSection 
          title="Vital Signs" 
          icon={<Heart className="w-5 h-5 text-blue-600" />}
          fields={[
            { name: "SystolicBP", label: "Systolic Blood Pressure (mmHg)", type: "number", min: 70, max: 220 },
            { name: "DiastolicBP", label: "Diastolic Blood Pressure (mmHg)", type: "number", min: 40, max: 120 },
            { name: "CholesterolTotal", label: "Total Cholesterol (mg/dL)", type: "number", step: "0.01", min: 100, max: 300 },
            { name: "CholesterolLDL", label: "LDL Cholesterol (mg/dL)", type: "number", step: "0.01", min: 0, max: 200 },
            { name: "CholesterolHDL", label: "HDL Cholesterol (mg/dL)", type: "number", step: "0.01", min: 20, max: 100 },
            { name: "CholesterolTriglycerides", label: "Triglycerides (mg/dL)", type: "number", step: "0.01", min: 50, max: 500 }
          ]}
          formData={formData}
          onChange={handleInputChange}
        />

        <FormSection 
          title="Cognitive Assessment" 
          icon={<Brain className="w-5 h-5 text-blue-600" />}
          fields={[
            { name: "MMSE", label: "Mini-Mental State Examination (0-30)", type: "number", step: "0.01", min: 0, max: 30 },
            { name: "FunctionalAssessment", label: "Functional Assessment (scale 1-10)", type: "number", step: "0.01", min: 1, max: 10 },
            { name: "MemoryComplaints", label: "Memory Complaints", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "BehavioralProblems", label: "Behavioral Problems", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "ADL", label: "Activities of Daily Living (scale 1-10)", type: "number", step: "0.01", min: 1, max: 10 }
          ]}
          formData={formData}
          onChange={handleInputChange}
        />

        <FormSection 
          title="Symptoms" 
          icon={<Dumbbell className="w-5 h-5 text-blue-600" />}
          fields={[
            { name: "Confusion", label: "Confusion", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "Disorientation", label: "Disorientation", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "PersonalityChanges", label: "Personality Changes", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "DifficultyCompletingTasks", label: "Difficulty Completing Tasks", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] },
            { name: "Forgetfulness", label: "Forgetfulness", type: "select", options: [
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ] }
          ]}
          formData={formData}
          onChange={handleInputChange}
        />

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => fillSampleData(1)}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sample Patient 1
            </button>
            <button
              type="button"
              onClick={() => fillSampleData(2)}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sample Patient 2
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="py-2 px-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reset
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Predict Risk'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <h3 className="text-lg font-medium text-red-900">Error</h3>
          <p className="mt-2 text-red-800">{error}</p>
        </div>
      )}

      {prediction && !error && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
          <h3 className="text-lg font-medium text-blue-900">Prediction Result</h3>
          <p className="mt-2 text-blue-800">{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;