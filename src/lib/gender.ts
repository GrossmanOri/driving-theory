// Hebrew is gendered, so UI strings adapt to the user's gender.
// `gw(female, male)` returns the right form. Default is female (the app's
// original voice) until the profile loads and sets the real value.

export type Gender = 'f' | 'm';

let current: Gender = 'f';

export function setGender(g: Gender | string | undefined) {
  if (g === 'm' || g === 'f') current = g;
}

export function getGender(): Gender {
  return current;
}

/** Pick the female or male form of a string. */
export function gw(female: string, male: string): string {
  return current === 'm' ? male : female;
}
