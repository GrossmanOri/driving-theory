// Hebrew is gendered, so UI strings adapt to the user's gender.
// `gw(female, male)` returns the right form. Default is female (the app's
// original voice) until the profile loads and sets the real value.

let current = 'f';

export function setGender(g) {
  if (g === 'm' || g === 'f') current = g;
}

export function getGender() {
  return current;
}

/** Pick the female or male form of a string. */
export function gw(female, male) {
  return current === 'm' ? male : female;
}
