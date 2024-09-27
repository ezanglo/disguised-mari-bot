declare module 'wiki-helper' {
  export type TypeData = {
    "item-name": string | null,
    source: string | null,
  }

  export type TextData = TypeData & {
    value: string,
  }

  export type MediaData = TypeData & {
    url: string,
    name: string,
    key: string,
    alt: string,
    caption: string,
    isVideo: boolean,
  }

  export type DataData = TypeData & {
    label: string,
    value: string,
    span: number,
    layout: string | null,
  }

  export type GroupData = TypeData & {
    value: InfoboxData[],
    layout: string | null,
    collapse: boolean | null,
    'row-items': string | null,
  }

  export type InfoboxData = {
    type: 'title',
    data: TextData
  } | {
    type: 'header',
    data: TextData
  } | {
    type: 'image',
    data: MediaData[]
  } | {
    type: 'group',
    data: GroupData
  } | {
    type: 'data',
    data: DataData
  }

  export type InfoboxProps = {
    parser_tag_version: number;
    data: InfoboxData[]
  }

  export type SkillData = {
    name: string;
    description: string;
    pvpDescription?: string;
    image?: string;
    skillType?: string;
    sp?: string;
    cooldown?: string;
    upgrades?: {
      level: string;
      description: string;
      pvpDescription?: string;
      image?: string;
    }[];
  };
}
