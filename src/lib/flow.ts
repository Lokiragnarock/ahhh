import { getQuestions } from "./questions";
import { getOrderedTopics } from "./vault";

export interface FlowTopic {
  id: string;
  slug: string;
  title: string;
  unit: string;
}

export interface Step {
  href: string;
  label: string;
}

export interface TopicFlow {
  topic: FlowTopic;
  prev?: FlowTopic;
  next?: FlowTopic; // next topic in study order (may be in the next unit)
  questionCount: number;
  afterDrill: Step; // mini test if the node has questions, else afterMini
  afterMini: Step; // next topic, or the unit's sectional test after the last topic
}

export const topicHref = (t: { slug: string }) => `/topic/${encodeURIComponent(t.slug)}`;
export const miniHref = (id: string) => `/practice/topic/${encodeURIComponent(id)}`;
export const sectionalHref = (unit: string) => `/practice/unit/${encodeURIComponent(unit)}`;

const lite = (t: FlowTopic): FlowTopic => ({ id: t.id, slug: t.slug, title: t.title, unit: t.unit });

export async function getFlowTopics(): Promise<FlowTopic[]> {
  return (await getOrderedTopics()).map(lite);
}

function nextUnitFirst(topics: FlowTopic[], unit: string): FlowTopic | undefined {
  const lastIdx = topics.map((t) => t.unit).lastIndexOf(unit);
  return lastIdx === -1 ? undefined : topics[lastIdx + 1];
}

// Where to go after a unit's sectional test.
export async function getUnitExit(unit: string): Promise<Step> {
  const next = nextUnitFirst(await getFlowTopics(), unit);
  return next ? { href: topicHref(next), label: `Next unit: ${next.unit} →` } : { href: "/practice/mock", label: "Full mock →" };
}

export async function getTopicFlow(slug: string): Promise<TopicFlow | null> {
  const [topics, questions] = await Promise.all([getFlowTopics(), getQuestions()]);
  const i = topics.findIndex((t) => t.slug === slug);
  if (i === -1) return null;
  const topic = topics[i];
  const prev = topics[i - 1];
  const after = topics[i + 1];
  const next = after && after.unit === topic.unit ? after : undefined;
  const questionCount = questions.filter((q) => q.node === topic.id).length;
  const unitHasQuestions = questions.some((q) => q.unit === topic.unit);

  let afterMini: Step;
  if (next) afterMini = { href: topicHref(next), label: `Next topic: ${next.id} →` };
  else if (unitHasQuestions) afterMini = { href: sectionalHref(topic.unit), label: `${topic.unit} sectional test →` };
  else {
    const nu = nextUnitFirst(topics, topic.unit);
    afterMini = nu ? { href: topicHref(nu), label: `Next unit: ${nu.unit} →` } : { href: "/practice/mock", label: "Full mock →" };
  }

  return {
    topic,
    prev,
    next: after,
    questionCount,
    afterDrill: questionCount > 0 ? { href: miniHref(topic.id), label: `Mini test · ${questionCount} q →` } : afterMini,
    afterMini,
  };
}

export async function getNodeFlow(nodeId: string): Promise<TopicFlow | null> {
  const t = (await getFlowTopics()).find((x) => x.id === nodeId);
  return t ? getTopicFlow(t.slug) : null;
}
