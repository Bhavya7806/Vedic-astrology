// No external APIs needed! 100% Free and Offline.
const generatePastFacts = async (chartData) => {
  try {
    const facts = [];
    const planets = chartData.planets || [];

    // Helper to find a specific planet in the user's calculated chart
    const getPlanet = (name) => planets.find(p => p.name === name);

    const sun = getPlanet('Sun');
    const moon = getPlanet('Moon');
    const mars = getPlanet('Mars');
    const jupiter = getPlanet('Jupiter');
    const saturn = getPlanet('Saturn');
    const rahu = getPlanet('Rahu');

    // Rule 1: Sun (Ego, Father, Authority)
    if (sun) {
      facts.push(`With your natal Sun positioned in ${sun.sign}, between 2018 and 2020, you likely experienced a significant transformation regarding authority figures, your father, or your core career path.`);
    }

    // Rule 2: Moon (Mind, Mother, Home)
    if (moon) {
      facts.push(`Your Moon's placement in ${moon.sign} indicates that around 2019-2021, you went through a sudden shift in your emotional foundation, living situation, or a close maternal relationship.`);
    }

    // Rule 3: Mars (Energy, Conflict, Drive)
    if (mars) {
      facts.push(`Because Mars occupies ${mars.sign} in your chart, roughly 4 to 5 years ago you had to aggressively defend your boundaries, overcome a sudden physical hurdle, or deal with intense competition.`);
    }

    // Rule 4: Jupiter (Wisdom, Education, Expansion)
    if (jupiter) {
      facts.push(`Jupiter's influence in ${jupiter.sign} suggests a major philosophical, educational, or spiritual shift occurred in your life between 2017 and 2019.`);
    }

    // Rule 5: Saturn (Karma, Delay, Hard Work)
    if (saturn) {
      facts.push(`Saturn's presence in ${saturn.sign} brought a period of intense isolation, heavy academic/career responsibility, or strict discipline into your life around the years 2020 to 2022.`);
    }

    // Rule 6: Rahu (Illusion, Sudden Events) - Backup rule
    if (rahu && facts.length < 5) {
      facts.push(`The shadow planet Rahu in ${rahu.sign} created a sudden, unexpected desire or a confusing turning point in your life trajectory around 2016-2017.`);
    }

    // Ensure we exactly return 5 facts
    return facts.slice(0, 5);

  } catch (error) {
    console.error("Local Trust Engine Error:", error);
    // Ultimate fallback just in case
    return [
      "You have experienced a significant shift in your educational or career trajectory in the last 4 years.",
      "A period of deep introspection and isolation occurred around 2020-2021.",
      "You have a natural intuition that you often ignore, which led to a specific regret around 2018.",
      "There was a sudden change in your family dynamics or residence between 2017 and 2019.",
      "You recently overcame a hidden obstacle related to your health or daily routines."
    ];
  }
};

module.exports = {
  generatePastFacts
};