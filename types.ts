export interface StoryPage {
  id: string;
  narrative: string;
  imageUrl: string;
  choices: string[];
  visualDescription: string; // Stored to help context for next image
  userChoice?: string; // The choice that led to the *next* page
}

export interface StoryContext {
  characterName: string;
  characterDescription: string;
  plotSummary: string;
  artStyle: string;
}

export interface StoryDraft {
  narrative: string;
  visualDescription: string;
  choices: string[];
}

export interface StoryState {
  pages: StoryPage[];
  isGenerating: boolean;
  error: string | null;
  context: StoryContext | null;
  draft: StoryDraft | null;
}

export interface GenAIStoryResponse {
  narrative: string;
  visual_description: string;
  choices: string[];
}