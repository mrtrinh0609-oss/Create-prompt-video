
export type Language = 'vietnamese' | 'english';

export interface Character {
  name: string;
  description: string;
  gender: string;
  visualPrompt: string;
}

export interface Dialogue {
  character: string;
  line: string;
}

export interface SceneDetails {
  scene_number: number;
  setting: string;
  camera_angle: string;
  action: string;
  dialogue: Dialogue[];
}

export interface ParsedScript {
  title: string;
  logline: string;
  characters: { name: string; description: string; gender: string; }[];
  scenes: SceneDetails[];
}
