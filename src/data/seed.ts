import type { Question, Topic } from './types';
import { SIGNS } from './signs';

// === SEED DATA — NOT the official question bank ===
// These ~16 sample questions are hand-written for development only.
// See README ("ייבוא מאגר השאלות הרשמי") for how to import the real
// class-B bank (~1,200 questions) from data.gov.il into this same schema.

export const topics: Topic[] = [
  { id: 'signs', name: 'תמרורים', icon: '🚸' },
  { id: 'rightofway', name: 'זכות קדימה', icon: '↔️' },
  { id: 'speed', name: 'מהירות ובלימה', icon: '🚗' },
  { id: 'safety', name: 'בטיחות', icon: '🦺' },
];

export const SEED = true;

export const seedQuestions: Question[] = [
  // --- תמרורים ---
  {
    id: 'sg1',
    topicId: 'signs',
    imageUrl: SIGNS.stop,
    text: 'מה עלייך לעשות כשמגיעים לתמרור הזה?',
    options: [
      { id: 'a', text: 'לעצור עצירה מוחלטת ולתת זכות קדימה', correct: true },
      { id: 'b', text: 'להאט בלבד ולהמשיך', correct: false },
      { id: 'c', text: 'לצפור ולהמשיך', correct: false },
      { id: 'd', text: 'להגביר מהירות', correct: false },
    ],
    explanation: 'תמרור "עצור" מחייב עצירה מלאה — גם אם הדרך נראית פנויה. עוצרים, מסתכלים, ורק אז ממשיכים.',
    difficulty: 1,
  },
  {
    id: 'sg2',
    topicId: 'signs',
    imageUrl: SIGNS.giveWay,
    text: 'מה משמעות התמרור המשולש ההפוך?',
    options: [
      { id: 'a', text: 'תן זכות קדימה לתנועה החוצה אותך', correct: true },
      { id: 'b', text: 'עצור תמיד', correct: false },
      { id: 'c', text: 'אסור להיכנס', correct: false },
      { id: 'd', text: 'דרך ראשית', correct: false },
    ],
    explanation: 'המשולש ההפוך אומר "תן זכות קדימה". לא חייבים לעצור, אבל חייבים לתת לאחרים לעבור קודם.',
    difficulty: 1,
  },
  {
    id: 'sg3',
    topicId: 'signs',
    imageUrl: SIGNS.noEntry,
    text: 'מה אומר התמרור הזה?',
    options: [
      { id: 'a', text: 'הכניסה אסורה לכל כלי רכב', correct: true },
      { id: 'b', text: 'חניה אסורה', correct: false },
      { id: 'c', text: 'סוף דרך מהירה', correct: false },
      { id: 'd', text: 'אין מעבר להולכי רגל', correct: false },
    ],
    explanation: 'עיגול אדום עם פס לבן באמצע = אין כניסה. הכיוון הזה חסום לתנועה.',
    difficulty: 1,
  },
  {
    id: 'sg4',
    topicId: 'signs',
    imageUrl: SIGNS.children,
    text: 'תמרור אזהרה זה מורה על:',
    options: [
      { id: 'a', text: 'קרבת ילדים — האטה וזהירות מוגברת', correct: true },
      { id: 'b', text: 'בית ספר סגור', correct: false },
      { id: 'c', text: 'גן שעשועים בלבד', correct: false },
      { id: 'd', text: 'מעבר חצייה תת-קרקעי', correct: false },
    ],
    explanation: 'משולש אדום עם ילדים = ייתכנו ילדים בכביש. מאטים ומוכנים לעצור.',
    difficulty: 2,
  },
  {
    id: 'sg5',
    topicId: 'signs',
    imageUrl: SIGNS.roundabout,
    text: 'התמרור העגול הכחול עם החץ המעוגל מציין:',
    options: [
      { id: 'a', text: 'כיכר תנועה — סע לפי כיוון החץ', correct: true },
      { id: 'b', text: 'פנייה אסורה', correct: false },
      { id: 'c', text: 'דרך חד-סטרית', correct: false },
      { id: 'd', text: 'תחנת אוטובוס', correct: false },
    ],
    explanation: 'תמרור חובה כחול: יש לנוע בכיכר לפי כיוון החצים, מימין לשמאל.',
    difficulty: 2,
  },

  // --- זכות קדימה ---
  {
    id: 'rw1',
    topicId: 'rightofway',
    imageUrl: SIGNS.giveWay,
    text: 'בצומת ללא תמרורים, למי יש זכות קדימה?',
    options: [
      { id: 'a', text: 'לרכב הבא מימין', correct: true },
      { id: 'b', text: 'לרכב הבא משמאל', correct: false },
      { id: 'c', text: 'למי שנוסע מהר יותר', correct: false },
      { id: 'd', text: 'לרכב הגדול יותר', correct: false },
    ],
    explanation: 'כלל הברירה: כשאין תמרור או רמזור, נותנים זכות קדימה לבא מימין.',
    difficulty: 2,
  },
  {
    id: 'rw2',
    topicId: 'rightofway',
    imageUrl: SIGNS.pedestrianZebra,
    text: 'מתקרבים למעבר חצייה והולך רגל ממתין בקצה. מה עושים?',
    options: [
      { id: 'a', text: 'מאטים ונותנים לו לחצות בבטחה', correct: true },
      { id: 'b', text: 'ממשיכים כי הוא עדיין על המדרכה', correct: false },
      { id: 'c', text: 'צופרים שימשיך ללכת', correct: false },
      { id: 'd', text: 'עוקפים מצד שני', correct: false },
    ],
    explanation: 'להולך רגל במעבר חצייה — או שממתין לחצות — תמיד יש זכות קדימה.',
    difficulty: 1,
  },
  {
    id: 'rw3',
    topicId: 'rightofway',
    imageUrl: SIGNS.trafficLight,
    text: 'הרמזור מתחלף לצהוב כשאת מתקרבת לצומת. מה הפעולה הנכונה?',
    options: [
      { id: 'a', text: 'לעצור לפני הצומת אם ניתן לעצור בבטחה', correct: true },
      { id: 'b', text: 'להאיץ כדי להספיק', correct: false },
      { id: 'c', text: 'לעצור באמצע הצומת', correct: false },
      { id: 'd', text: 'להתעלם ולהמשיך', correct: false },
    ],
    explanation: 'צהוב = היכוני לעצור. אם אפשר לעצור בבטחה לפני הצומת — עוצרים.',
    difficulty: 2,
  },
  {
    id: 'rw4',
    topicId: 'rightofway',
    imageUrl: SIGNS.keepRight,
    text: 'רכב חירום עם סירנה מתקרב מאחור. מה עושים?',
    options: [
      { id: 'a', text: 'מפנים לו דרך בצד ימין ועוצרים אם צריך', correct: true },
      { id: 'b', text: 'ממשיכים באותה מהירות', correct: false },
      { id: 'c', text: 'בולמים בחדות במקום', correct: false },
      { id: 'd', text: 'מאיצים כדי לא להפריע', correct: false },
    ],
    explanation: 'לרכב חירום בקריאה תמיד יש זכות קדימה. מתקרבים לימין ומאפשרים לו לעבור.',
    difficulty: 1,
  },

  // --- מהירות ובלימה ---
  {
    id: 'sp1',
    topicId: 'speed',
    imageUrl: SIGNS.speed50,
    text: 'מהי מגבלת המהירות שמורה התמרור?',
    options: [
      { id: 'a', text: '50 קמ"ש', correct: true },
      { id: 'b', text: 'מהירות מומלצת 50', correct: false },
      { id: 'c', text: 'מרחק 50 מטר', correct: false },
      { id: 'd', text: 'מינימום 50 קמ"ש', correct: false },
    ],
    explanation: 'מספר בעיגול אדום = מהירות מרבית מותרת. כאן: עד 50 קמ"ש.',
    difficulty: 1,
  },
  {
    id: 'sp2',
    topicId: 'speed',
    imageUrl: SIGNS.slippery,
    text: 'בכביש רטוב, מרחק הבלימה של הרכב:',
    options: [
      { id: 'a', text: 'מתארך — צריך לשמור מרחק גדול יותר', correct: true },
      { id: 'b', text: 'מתקצר', correct: false },
      { id: 'c', text: 'לא משתנה', correct: false },
      { id: 'd', text: 'מתאפס', correct: false },
    ],
    explanation: 'כביש רטוב מפחית אחיזה, ולכן מרחק הבלימה גדל. מאטים ושומרים מרחק.',
    difficulty: 2,
  },
  {
    id: 'sp3',
    topicId: 'speed',
    imageUrl: SIGNS.speed30,
    text: 'באזור מגורים עם תמרור 30, מותר לנסוע:',
    options: [
      { id: 'a', text: 'עד 30 קמ"ש', correct: true },
      { id: 'b', text: 'עד 50 קמ"ש', correct: false },
      { id: 'c', text: 'כל מהירות אם אין אנשים', correct: false },
      { id: 'd', text: 'לפחות 30 קמ"ש', correct: false },
    ],
    explanation: 'אזורי 30 נועדו לבטיחות הולכי רגל. נוסעים לאט — עד 30 קמ"ש.',
    difficulty: 1,
  },
  {
    id: 'sp4',
    topicId: 'speed',
    text: 'מהו "מרחק התגובה"?',
    options: [
      { id: 'a', text: 'הדרך שהרכב עובר מרגע שראית סכנה ועד שלחצת על הבלם', correct: true },
      { id: 'b', text: 'הדרך מרגע הלחיצה על הבלם ועד עצירה', correct: false },
      { id: 'c', text: 'המרחק בין שני רכבים', correct: false },
      { id: 'd', text: 'זמן הנסיעה הכולל', correct: false },
    ],
    explanation: 'מרחק התגובה הוא מה שהרכב נוסע בזמן שלוקח לך להגיב. עייפות ומהירות מגדילות אותו.',
    difficulty: 3,
  },

  // --- בטיחות ---
  {
    id: 'sf1',
    topicId: 'safety',
    text: 'מתי חובה לחגור חגורת בטיחות?',
    options: [
      { id: 'a', text: 'תמיד, בכל נסיעה ובכל מושב שיש בו חגורה', correct: true },
      { id: 'b', text: 'רק בכביש מהיר', correct: false },
      { id: 'c', text: 'רק הנהג', correct: false },
      { id: 'd', text: 'רק בנסיעה ארוכה', correct: false },
    ],
    explanation: 'חגורה מצילה חיים — חובה לחגור בכל נסיעה, גם קצרה, וגם במושב האחורי.',
    difficulty: 1,
  },
  {
    id: 'sf2',
    topicId: 'safety',
    imageUrl: SIGNS.noParking,
    text: 'התמרור הזה (עיגול כחול עם קו אדום) מציין:',
    options: [
      { id: 'a', text: 'חניה אסורה', correct: true },
      { id: 'b', text: 'עצירה וחניה אסורות', correct: false },
      { id: 'c', text: 'תחנת מוניות', correct: false },
      { id: 'd', text: 'חניה מותרת', correct: false },
    ],
    explanation: 'קו אדום אחד = חניה אסורה (אפשר לעצור לרגע להעלאת נוסע). שני קווים = גם עצירה אסורה.',
    difficulty: 2,
  },
  {
    id: 'sf3',
    topicId: 'safety',
    text: 'שימוש בטלפון נייד ביד בזמן נהיגה:',
    options: [
      { id: 'a', text: 'אסור — מסיח את הדעת ומסוכן', correct: true },
      { id: 'b', text: 'מותר בנסיעה איטית', correct: false },
      { id: 'c', text: 'מותר ברמזור אדום', correct: false },
      { id: 'd', text: 'מותר אם מחזיקים ביד אחת', correct: false },
    ],
    explanation: 'אחיזת טלפון ביד בנהיגה אסורה ומסוכנת. אם חייבים — דיבורית בלבד.',
    difficulty: 1,
  },
];
