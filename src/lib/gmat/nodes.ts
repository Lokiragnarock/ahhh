// Planner node -> StudyDuel question-bank topic, and node -> subject folder.
// Several nodes share one topic (Algebra, Critical Reasoning, ...): the whole
// pool of that topic is offered under each of its nodes. A null topic means
// the node has no questions in the bank.

interface GmatNode {
  subject: string;
  topic: string | null;
}

export const GMAT_NODES: Record<string, GmatNode> = {
  "Q-1": { subject: "gmat-quant", topic: "Number Properties" },
  "Q-2": { subject: "gmat-quant", topic: "Arithmetic" },
  "Q-3": { subject: "gmat-quant", topic: "Percents" },
  "Q-4": { subject: "gmat-quant", topic: "Ratio & Proportion" },
  "Q-5": { subject: "gmat-quant", topic: "Profit & Loss" },
  "Q-6": { subject: "gmat-quant", topic: "Averages" },
  "Q-7": { subject: "gmat-quant", topic: "Algebra" },
  "Q-8": { subject: "gmat-quant", topic: "Algebra" },
  "Q-9": { subject: "gmat-quant", topic: "Algebra" },
  "Q-10": { subject: "gmat-quant", topic: "Rates And Work" },
  "Q-11": { subject: "gmat-quant", topic: "Word Problems" },
  "Q-12": { subject: "gmat-quant", topic: "Statistics" },
  "Q-13": { subject: "gmat-quant", topic: "Probability And Counting" },
  "V-1": { subject: "gmat-verbal", topic: "Critical Reasoning" },
  "V-2": { subject: "gmat-verbal", topic: "Critical Reasoning" },
  "V-3": { subject: "gmat-verbal", topic: "Critical Reasoning" },
  "V-4": { subject: "gmat-verbal", topic: "Critical Reasoning" },
  "V-5": { subject: "gmat-verbal", topic: "Reading Comprehension" },
  "V-6": { subject: "gmat-verbal", topic: "Reading Comprehension" },
  "D-1": { subject: "gmat-di", topic: "Data Sufficiency" },
  "D-2": { subject: "gmat-di", topic: "Data Sufficiency" },
  "D-3": { subject: "gmat-di", topic: "Table Analysis" },
  "D-4": { subject: "gmat-di", topic: "Graphics Interpretation" },
  "D-5": { subject: "gmat-di", topic: "Two Part Analysis" },
  "D-6": { subject: "gmat-di", topic: "Multi Source Reasoning" },
  "D-7": { subject: "gmat-di", topic: null },
  "S-1": { subject: "gmat-strategy", topic: null },
  "S-2": { subject: "gmat-strategy", topic: null },
  "S-3": { subject: "gmat-strategy", topic: null },
  "S-4": { subject: "gmat-strategy", topic: null },
  "S-5": { subject: "gmat-strategy", topic: null },
};

export function topicOfNode(node: string): string | null {
  return GMAT_NODES[node]?.topic ?? null;
}

// Every node a topic's questions are offered under, optionally within one
// subject folder.
export function nodesOfTopic(topic: string, subject?: string): string[] {
  return Object.entries(GMAT_NODES)
    .filter(([, n]) => n.topic === topic && (!subject || n.subject === subject))
    .map(([id]) => id);
}
