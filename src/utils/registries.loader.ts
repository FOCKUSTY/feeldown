import type {
  BackgroundAnimationsRegistry,
  CharacterAnimationsRegistry,
  CharactersRegistry,
  EmotionsRegistry,
  EventsRegistry,
  GameEffectsRegistry,
  VariablesRegistry,
} from "@/types/registries";

import { readFile } from "fs/promises";
import { join } from "path";
import { parse } from "yaml";

export type Registries = {
  characters: CharactersRegistry;
  emotions: EmotionsRegistry;
  variables: VariablesRegistry;
  events: EventsRegistry;
  characterAnimations: CharacterAnimationsRegistry;
  backgroundAnimations: BackgroundAnimationsRegistry;
  gameEffects: GameEffectsRegistry;
};
export type Registry = keyof Registries;

const REGISTRIES: Record<Registry, string> = {
  variables: "Переменные",
  characterAnimations: "Персонажи_Анимации",
  characters: "Персонажи",
  events: "События",
  backgroundAnimations: "Фон_Анимации",
  emotions: "Эмоции",
  gameEffects: "Эффекты",
} as const;

const TYPES: Record<Registry, string> = {
  variables: "variables",
  characterAnimations: "animations",
  characters: "characters",
  events: "events",
  backgroundAnimations: "animations",
  emotions: "emotions",
  gameEffects: "effects",
} as const;

export class RegistryLoader {
  private readonly _registry_path: string;

  public constructor(registryPath: string) {
    this._registry_path = registryPath;
  }

  public async loadAll() {
    const entriesPromise = Object.keys(REGISTRIES).map(async (r) => {
      const registry = r as Registry;
      const yaml = await this.execute(registry);
      return [registry, yaml] as const;
    });

    const entries = await Promise.all(entriesPromise);
    return Object.fromEntries(entries) as unknown as Registries;
  }

  public async execute<const T extends Registry>(registry: T) {
    return this.loadYaml<Registries[T]>(
      `${REGISTRIES[registry]}.yaml`,
      TYPES[registry],
    );
  }

  private async loadYaml<T>(fileName: string, type: string): Promise<T> {
    const filePath = join(this._registry_path, fileName);

    try {
      const content = await readFile(filePath, "utf-8");
      const data = parse(content);
      return data[type];
    } catch (err) {
      throw new Error(`Failed to load registry ${fileName}: ${err}`);
    }
  }
}
