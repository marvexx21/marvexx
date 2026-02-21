import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // make sure this matches Netlify
);

export async function handler(event) {
  try {
    const { user_id, description, totalDebit, totalCredit, lines } = JSON.parse(event.body);

    const { data: entry, error: entryError } = await supabase
      .from('journal_entries')
      .insert([{
        user_id,
        description,
        total_debit: totalDebit,
        total_credit: totalCredit
      }])
      .select()
      .single();

    if (entryError) throw entryError;

    const rows = lines.map(l => ({
      entry_id: entry.id,
      date: l.date,
      account: l.account,
      ref: l.ref,
      debit: l.debit,
      credit: l.credit
    }));

    const { error: linesError } = await supabase
      .from('journal_lines')
      .insert(rows);

    if (linesError) throw linesError;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
}
