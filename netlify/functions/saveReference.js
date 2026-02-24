const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  try {
    const { user_id, name } = JSON.parse(event.body || "{}")

    if (!user_id || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing fields" })
      }
    }

    const { error } = await supabase
      .from('account_references')
      .insert([{ user_id, name }])

    if (error) throw error

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
