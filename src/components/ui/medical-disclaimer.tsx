import React from "react";
import { AlertTriangle } from "lucide-react";

interface MedicalDisclaimerProps {
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ className = "" }) => {
  return (
    <div
      className={`glass-panel border-l-4 border-brand-danger rounded-xl p-4 md:p-5 flex items-start space-x-3.5 shadow-sm ${className}`}
    >
      <div className="flex-shrink-0 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg text-brand-danger">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">
          Important Medical Screening Disclaimer
        </h4>
        <p className="text-xs text-red-700/95 dark:text-red-300/90 leading-relaxed">
          Arogya AI is an AI-assisted health screening tool designed to promote early health awareness and preventive wellness. 
          It does not provide medical diagnoses, treatment plans, prescriptions, or clinical medical advice. 
          Always consult a qualified healthcare professional or doctor for formal medical diagnosis and clinical treatment.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
