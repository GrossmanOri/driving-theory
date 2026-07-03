# לומדים תיאוריה 🚗

אפליקציה ללימוד מבחן התיאוריה (רישיון דרגה B), בנויה להיות אינטראקטיבית,
מעודדת וויזואלית — בלי לחץ ובלי עונשים. כל הממשק בעברית, RTL.

## הרצה מקומית

```bash
npm install
npm run dev
```

הדפדפן ייפתח בכתובת שמודפסת במסך (בדרך כלל http://localhost:5173).

בנייה לפרודקשן:

```bash
npm run build      # יוצר תיקיית dist/
npm run preview    # תצוגה מקדימה של הבנייה
```

## פריסה (Deploy)

זהו אתר סטטי לחלוטין — אין שרת, אין מסד נתונים, אין התחברות.
כל ההתקדמות נשמרת ב-`localStorage` בדפדפן.

**Vercel:** מייבאים את הריפו, framework: Vite. פקודת build `npm run build`,
תיקיית פלט `dist`.

**Netlify:** Build command `npm run build`, Publish directory `dist`.

> שימי לב: כיוון שמשתמשים ב-`BrowserRouter`, צריך הפניית SPA לכל הנתיבים אל
> `index.html`. ב-Vercel זה אוטומטי; ב-Netlify הוסיפי קובץ `public/_redirects`
> עם השורה: `/*  /index.html  200`.

## מבנה הפרויקט

```
src/
  data/        טיפוסים, נתוני seed, ו-loader (מקור אמת יחיד)
  hooks/       useProgress + ProgressContext (localStorage)
  lib/         leitner (חזרה מרווחת), speech (הקראה), dailyGoal
  components/  QuestionCard, TopBar, Stars, confetti
  pages/       Home, Learn, Mistakes, Exam, Settings
```

## על המבחן (משמש במצב "מבחן דמה")

- 30 שאלות, 4 תשובות לכל אחת, 40 דקות.
- ציון עובר: 26 מתוך 30 (עד 4 טעויות).
- מאגר השאלות הרשמי לדרגה B כולל ~1,200 שאלות ב-22 נושאים, כ-data פתוח
  ב-data.gov.il וב-gov.il.

## ⚠️ נתוני ה-seed אינם המאגר הרשמי

הקובץ `src/data/seed.js` מכיל ~16 שאלות לדוגמה שנכתבו לצורכי פיתוח בלבד,
ב-3–4 נושאים. הן מסומנות בבירור (`export const SEED = true`).
**אין להתייחס אליהן כשאלות רשמיות.**

### ייבוא מאגר השאלות הרשמי

הסכמה כבר מוכנה לקליטת המאגר הרשמי. כדי לייבא:

1. הורידי את קובץ ה-JSON/CSV של מאגר דרגה B מ-data.gov.il / gov.il.
2. כתבי סקריפט המרה (למשל `scripts/import.js`) הממפה כל רשומה ל-`Question`:

   ```ts
   interface Question {
     id: string;
     topicId: string;       // מיפוי לקטגוריות שב-src/data/seed.js -> topics
     imageUrl?: string;     // קישור לתמונת התמרור
     text: string;
     options: { id: string; text: string; correct: boolean }[];
     explanation: string;
     difficulty?: 1 | 2 | 3;
   }
   ```

3. שמרי את הפלט כ-`src/data/official.js` המייצא `officialQuestions: Question[]`.
4. בקובץ `src/data/loader.js` החליפי את `const allQuestions = seedQuestions`
   ב-`const allQuestions = officialQuestions`. אף קובץ אחר לא צריך להשתנות.

## נגישות

RTL מלא, פונטים גדולים (18px+), ניגודיות גבוהה, צבע אף פעם לא אות יחיד
(תמיד אייקון + טקסט), בקרת גודל טקסט בהגדרות, הקראה בקול (Web Speech, he-IL),
וכיבוד `prefers-reduced-motion`.
