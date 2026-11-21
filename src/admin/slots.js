/*
  The four video spots on the homepage, as the admin panel explains them.
  Spot N fills ORBIT[N-1] in src/components/Hero.jsx: keep the two in sync.
*/
export const SLOTS = [
  {
    n: 1,
    name: "Main video",
    where: "Big phone, left of the headline",
    note: "Plays first when someone taps “Watch the reels”.",
    // position on the homepage map (same numbers as ORBIT)
    pos: { left: "3.5%", top: "15%", width: "15%", rotate: -7 },
  },
  {
    n: 2,
    name: "Second video",
    where: "Big phone, right of the headline",
    pos: { right: "3.5%", top: "12%", width: "14.5%", rotate: 6 },
  },
  {
    n: 3,
    name: "Third video",
    where: "Small phone, bottom right",
    pos: { right: "15.5%", bottom: "4%", width: "10.5%", rotate: -5 },
  },
  {
    n: 4,
    name: "Fourth video",
    where: "Small phone, bottom left",
    pos: { left: "15%", bottom: "5%", width: "9.5%", rotate: 6 },
  },
];

export const FREE_LIMIT = 100 * 1024 * 1024; // Cloudinary free plan: max video size
