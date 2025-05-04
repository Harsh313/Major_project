import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import * as pickle from "npm:pickle";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const data = await req.json();
    
    // Convert the input data into a feature array
    const features = [
      parseInt(data.Age),
      parseInt(data.Gender),
      parseInt(data.Ethnicity),
      parseInt(data.EducationLevel),
      parseFloat(data.BMI),
      parseInt(data.Smoking),
      parseFloat(data.AlcoholConsumption),
      parseFloat(data.PhysicalActivity),
      parseFloat(data.DietQuality),
      parseFloat(data.SleepQuality),
      parseInt(data.FamilyHistoryAlzheimers),
      parseInt(data.CardiovascularDisease),
      parseInt(data.Diabetes),
      parseInt(data.Depression),
      parseInt(data.HeadInjury),
      parseInt(data.Hypertension),
      parseInt(data.SystolicBP),
      parseInt(data.DiastolicBP),
      parseFloat(data.CholesterolTotal),
      parseFloat(data.CholesterolLDL),
      parseFloat(data.CholesterolHDL),
      parseFloat(data.CholesterolTriglycerides),
      parseFloat(data.MMSE),
      parseFloat(data.FunctionalAssessment),
      parseInt(data.MemoryComplaints),
      parseInt(data.BehavioralProblems),
      parseInt(data.ADL),
      parseInt(data.Confusion),
      parseInt(data.Disorientation),
      parseInt(data.PersonalityChanges),
      parseInt(data.DifficultyCompletingTasks),
      parseInt(data.Forgetfulness)
    ];

    // Load and use the model
    try {
      const modelFile = await Deno.readFile('./xgb_best_model.pkl');
      const scalerFile = await Deno.readFile('./scaler.pkl');
      
      const model = pickle.loads(modelFile);
      const scaler = pickle.loads(scalerFile);
      
      // Scale features
      const scaledFeatures = scaler.transform([features]);
      
      // Make prediction
      const prediction = model.predict(scaledFeatures)[0];
      
      const result = prediction === 1 
        ? "High risk of Alzheimer's Disease detected (Please consult a healthcare professional)" 
        : "Low risk of Alzheimer's Disease detected";

      return new Response(
        JSON.stringify({ prediction: result }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    } catch (modelError) {
      console.error('Model error:', modelError);
      
      // Fallback to mock prediction if model fails
      const mockPrediction = Math.random() > 0.5;
      const result = mockPrediction 
        ? "High risk of Alzheimer's Disease detected (Demo Mode)" 
        : "Low risk of Alzheimer's Disease detected (Demo Mode)";

      return new Response(
        JSON.stringify({ prediction: result }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});