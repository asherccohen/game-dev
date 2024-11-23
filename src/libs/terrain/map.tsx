import { Vector3 } from 'three';

type MapProps = {
  [key: string]: {
    scale: number;
    position: Vector3;
  };
};

export const maps: MapProps = {
  ground: {
    scale: 1,
    position: new Vector3(0, 0, 0),
  },
  castle_on_hills: {
    scale: 3,
    position: new Vector3(-6, -7, 0),
  },
  animal_crossing_map: {
    scale: 20,
    position: new Vector3(-15, -1, 10),
  },
  city_scene_tokyo: {
    scale: 0.72,
    position: new Vector3(0, -1, -3.5),
  },
  de_dust_2_with_real_light: {
    scale: 0.3,
    position: new Vector3(-5, -3, 13),
  },
  medieval_fantasy_book: {
    scale: 0.4,
    position: new Vector3(-4, 0, -6),
  },
};
