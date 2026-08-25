async function testStatCardsLogic() {
  const dbUrl = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
  const neonUrl = 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
  try {
    const res = await fetch(neonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': dbUrl
      },
      body: JSON.stringify({
        query: 'SELECT card_key, page, category, label, value, subtext, icon, order_index FROM site_stat_cards ORDER BY order_index ASC'
      })
    });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Directly fetched stat cards from Neon Cloud Database:');
      data.rows.forEach(r => {
        console.log(`  - [${r.page}] ${r.card_key} ("${r.label}") = "${r.value}"`);
      });
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testStatCardsLogic();
