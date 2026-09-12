// Etapa 7: Equipment (Equipamento) — corebook p.341-355 (capítulo Equipment).
// Fonte: reference/corebook_fulltext.txt, páginas 341-355.
// Preços em Riquezas ("Wealth" no livro). O personagem começa com 5
// Riquezas para gastar livremente, além do Equipamento de Viagem gratuito.

export type EquipmentCategory =
  | "EVERYDAY"
  | "MEDICINE"
  | "SERVICE"
  | "WEAPON"
  | "ARMOR"
  | "SHIELD"
  | "WYRDNESS_PROTECTION";

export interface EquipmentItemDef {
  key: string;
  name: string;
  category: EquipmentCategory;
  cost: number;
  summary: string;
  // Dano (armas) ou Proteção (armaduras/escudos) quando aplicável.
  damage?: number;
  protection?: number | { offensive: number; standard: number; defensive: number };
  range?: string;
  twoHanded?: boolean;
}

export const EQUIPMENT: EquipmentItemDef[] = [
  // --- Itens do dia a dia (p.341) ---
  { key: "EXPLORERS_GEAR", name: "Kit de Explorador", category: "EVERYDAY", cost: 1, summary: "+1 em Proezas, Ambiente Natural e Viagem quando útil." },
  { key: "HAVERSACK", name: "Mochila de Soldado", category: "EVERYDAY", cost: 1, summary: "+1 em Liderança e Ambiente Natural." },
  { key: "SCHOLARS_KIT", name: "Kit de Erudito", category: "EVERYDAY", cost: 1, summary: "+1 em Erudição, Performance e Religião." },
  { key: "TRAVEL_RATIONS", name: "Rações de Viagem (3 dias)", category: "EVERYDAY", cost: 1, summary: "Recupera 1 PV por dia enquanto durarem as provisões." },

  // --- Medicina (p.342-343) ---
  { key: "ANTIDOTE", name: "Antídoto", category: "MEDICINE", cost: 2, summary: "Previne os efeitos de um envenenamento identificado." },
  { key: "BASIC_REMEDY", name: "Remédio Básico", category: "MEDICINE", cost: 3, summary: "Recupera 3 PV extras (uso limitado a 1x por dia)." },
  { key: "HEALERS_POUCH", name: "Bolsa de Curandeiro", category: "MEDICINE", cost: 1, summary: "+2 em rolagens de Cura." },
  { key: "HEALING_ESSENCE", name: "Essência de Cura", category: "MEDICINE", cost: 5, summary: "Recupera 6 PV extras." },
  { key: "TEARS_OF_THE_ALLMOTHER", name: "Lágrimas da Allmother", category: "MEDICINE", cost: 10, summary: "Cura doenças até \"Maligna\" e recupera 10 PV." },

  // --- Serviços (p.344-345) ---
  { key: "CARAVAN", name: "Caravana (por passageiro)", category: "SERVICE", cost: 1, summary: "Viagem escoltada por um Andarilho da Névoa." },
  { key: "MOUNT", name: "Montaria", category: "SERVICE", cost: 3, summary: "Necessária para Combate Montado (2 a 5 Riquezas conforme a qualidade)." },
  { key: "NIGHT_AT_INN", name: "Noite em Pousada (grupo de 4-6)", category: "SERVICE", cost: 1, summary: "Descanso reparador; +2 em Resistência Mental por 24h." },
  { key: "MEDICAL_PRESCRIPTION", name: "Prescrição Médica", category: "SERVICE", cost: 2, summary: "Recupera 2 PV (uso único)." },
  { key: "SCRIBING_SERVICES", name: "Serviços de Escrivão", category: "SERVICE", cost: 1, summary: "Escrever ou ler um documento." },

  // --- Armas corpo a corpo (p.347-349) ---
  { key: "BATTLE_AXE", name: "Machado de Batalha", category: "WEAPON", cost: 1, damage: 3, range: "1", twoHanded: true, summary: "Machado — dano 3." },
  { key: "DOUBLE_HEADED_AXE", name: "Machado de Duas Cabeças", category: "WEAPON", cost: 1, damage: 4, range: "1", twoHanded: true, summary: "Machado — dano 4." },
  { key: "FRANCISCA_MELEE", name: "Francisca (uma mão)", category: "WEAPON", cost: 1, damage: 2, range: "1", summary: "Machado leve, também pode ser arremessado." },
  { key: "BROADSWORD", name: "Espada Larga", category: "WEAPON", cost: 2, damage: 3, range: "1", summary: "Lâmina — dano 3." },
  { key: "CLAYMORE", name: "Claymore", category: "WEAPON", cost: 2, damage: 4, range: "1", twoHanded: true, summary: "Lâmina de duas mãos — dano 4." },
  { key: "LONG_SWORD", name: "Espada Longa", category: "WEAPON", cost: 2, damage: 3, range: "1", summary: "Lâmina — dano 3." },
  { key: "SABER", name: "Sabre", category: "WEAPON", cost: 2, damage: 2, range: "1", summary: "Lâmina — dano 2." },
  { key: "SHORT_SWORD_BLADE", name: "Espada Curta", category: "WEAPON", cost: 2, damage: 2, range: "1", summary: "Lâmina — dano 2." },
  { key: "CLUB", name: "Clava", category: "WEAPON", cost: 2, damage: 1, range: "1", summary: "Contundente — dano 1." },
  { key: "CRAFTSMANS_HAMMER", name: "Martelo de Artesão", category: "WEAPON", cost: 2, damage: 2, range: "1", summary: "Contundente — dano 2." },
  { key: "FLAIL", name: "Mangual", category: "WEAPON", cost: 2, damage: 3, range: "1", summary: "Contundente — dano 3." },
  { key: "MACE", name: "Maça", category: "WEAPON", cost: 2, damage: 3, range: "1", summary: "Contundente — dano 3." },
  { key: "STAFF", name: "Bastão", category: "WEAPON", cost: 2, damage: 2, range: "1", summary: "Contundente — dano 2." },
  { key: "WARHAMMER", name: "Martelo de Guerra", category: "WEAPON", cost: 2, damage: 4, range: "1", twoHanded: true, summary: "Contundente de duas mãos — dano 4." },
  { key: "BRUSH_HOOK", name: "Podão", category: "WEAPON", cost: 1, damage: 1, range: "1", summary: "Arma curta — dano 1." },
  { key: "DAGGER", name: "Adaga", category: "WEAPON", cost: 1, damage: 1, range: "1", summary: "Arma curta — dano 1." },
  { key: "DIRK", name: "Punhal", category: "WEAPON", cost: 1, damage: 2, range: "1", summary: "Arma curta — dano 2." },
  { key: "HALBERD", name: "Alabarda", category: "WEAPON", cost: 3, damage: 3, range: "2", twoHanded: true, summary: "Arma de haste — dano 3, alcance 2." },
  { key: "SPEAR", name: "Lança", category: "WEAPON", cost: 3, damage: 2, range: "2", twoHanded: true, summary: "Arma de haste — dano 2, alcance 2." },
  { key: "WAR_SCYTHE", name: "Foice de Guerra", category: "WEAPON", cost: 3, damage: 3, range: "2", twoHanded: true, summary: "Arma de haste — dano 3, alcance 2." },

  // --- Armas à distância (p.349) ---
  { key: "BOW", name: "Arco", category: "WEAPON", cost: 1, damage: 2, range: "18m", summary: "Dano 2, alcance 18m." },
  { key: "CROSSBOW", name: "Besta", category: "WEAPON", cost: 1, damage: 2, range: "22m", summary: "Dano 2, alcance 22m." },
  { key: "DAGGER_THROWN", name: "Adaga (arremesso)", category: "WEAPON", cost: 1, damage: 1, range: "5m", summary: "Dano 1, alcance 5m." },
  { key: "FRANCISCA_THROWN", name: "Francisca (arremesso)", category: "WEAPON", cost: 1, damage: 2, range: "7m", summary: "Dano 2, alcance 7m." },
  { key: "JAVELIN", name: "Azagaia", category: "WEAPON", cost: 1, damage: 2, range: "9m", summary: "Dano 2, alcance 9m." },
  { key: "SLING", name: "Funda", category: "WEAPON", cost: 1, damage: 1, range: "9m", summary: "Dano 1, alcance 9m." },

  // --- Armaduras (p.351-352) ---
  { key: "MAKESHIFT_ARMOR", name: "Armadura Improvisada", category: "ARMOR", cost: 3, protection: 1, summary: "Couro fervido com reforços — proteção 1." },
  { key: "REGULAR_ARMOR", name: "Armadura Regular", category: "ARMOR", cost: 5, protection: 2, summary: "Cota de malha sobre gibão — proteção 2." },
  { key: "MASTER_ARMOR", name: "Armadura de Mestre", category: "ARMOR", cost: 10, protection: 3, summary: "Armadura bem trabalhada — proteção 3." },
  { key: "PLATE_ARMOR", name: "Armadura de Placas", category: "ARMOR", cost: 25, protection: 4, summary: "A melhor armadura disponível — proteção 4." },

  // --- Escudos (p.352-353) ---
  { key: "HEATER_SHIELD", name: "Escudo Heráldico", category: "SHIELD", cost: 5, protection: { offensive: 1, standard: 2, defensive: 3 }, summary: "Proteção 1/2/3 conforme a postura." },
  { key: "PAVISE", name: "Pavês", category: "SHIELD", cost: 3, protection: { offensive: 0, standard: 1, defensive: 2 }, summary: "Proteção 0/1/2 conforme a postura." },
  { key: "RUDIMENTARY_SHIELD", name: "Escudo Rudimentar", category: "SHIELD", cost: 2, protection: { offensive: 0, standard: 0, defensive: 1 }, summary: "Proteção 0/0/1 conforme a postura." },
  { key: "CHARM_AMULET", name: "Amuleto de Proteção", category: "SHIELD", cost: 2, summary: "Absorve os primeiros 4 pontos de dano recebidos; depois se quebra." },

  // --- Proteções contra a Wyrdness (p.355) ---
  { key: "OGHAMIC_MARK", name: "Marca Ogâmica", category: "WYRDNESS_PROTECTION", cost: 5, summary: "Proteção contra a Wyrdness — ver capítulo A Wyrdness." },
  { key: "PROTECTIVE_TALISMAN", name: "Talismã Protetor", category: "WYRDNESS_PROTECTION", cost: 2, summary: "Proteção contra a Wyrdness — ver capítulo A Wyrdness." },
  { key: "WYRDCANDLE", name: "Vela da Wyrdness (3 unidades)", category: "WYRDNESS_PROTECTION", cost: 1, summary: "Proteção contra a Wyrdness — ver capítulo A Wyrdness." },
];

export function getEquipmentItem(key: string): EquipmentItemDef | undefined {
  return EQUIPMENT.find((e) => e.key === key);
}
