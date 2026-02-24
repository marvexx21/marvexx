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

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user_id)

    if (error) throw error

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, accounts: data })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    }
  }
}
