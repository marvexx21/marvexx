const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  const { user_id, lines, description } = JSON.parse(event.body || "{}")

  if (!user_id || !lines) {
    return { statusCode: 400, body: JSON.stringify({ error: "missing_data" }) }
  }

  const { error } = await supabase
    .from("journal_entries")
    .insert([{
      user_id,
      lines,
      description
    }])

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) }
}
