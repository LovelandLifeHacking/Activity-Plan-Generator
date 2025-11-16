
export interface ActivityPlan {
  activityTitle: string;
  activitySubtitle: string;
  activityDescription: string;
  learnerDescription: string;
  resources: string;
  activityPlan: string;
  learnerInstructions: string;
  learningAreas: string[];
  outcomeCodes: {
    English?: string[];
    Maths?: string[];
    Science?: string[];
    HASS?: string[];
    Technologies?: string[];
    "The Arts"?: string[];
    HPE?: string[];
  };
  identifiedThemes: string[];
  suggestedThemes: string[];
}
