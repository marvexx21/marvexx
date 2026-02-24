const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  try {
    const { user_id, description, lines } = JSON.parse(event.body || "{}")

    if (!user_id || !description || !lines || !lines.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing fields" })
      }
    }

    // Insert journal entry
    const { data: entryData, error: entryError } = await supabase
      .from('journal_entries')
      .insert([{ user_id, description }])
      .select()
      .single()

    if (entryError) throw entryError

    const entry_id = entryData.id

    // Prepare journal lines
    const lineRows = lines.map(l => ({
      entry_id,
      account_name: l.account_name,
      debit: l.debit,
      credit: l.credit
    }))

    // Insert lines
    const { error: linesError } = await supabase
      .from('journal_lines')
      .insert(lineRows)

    if (linesError) throw linesError

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    }
  }
}
