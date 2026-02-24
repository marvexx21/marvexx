const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  try {
    const user_id = event.queryStringParameters.user_id

    if (!user_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing user_id" })
      }
    }

    // Load entries
    const { data: entries, error: entryError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: true })

    if (entryError) throw entryError

    // Load lines + join accounts
    const { data: lines, error: lineError } = await supabase
      .from('journal_lines')
      .select(`
        id,
        entry_id,
        account_id,
        debit,
        credit,
        accounts ( name )
      `)
      .eq('user_id', user_id)

    if (lineError) throw lineError

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        entries,
        lines
      })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    }
  }
}
