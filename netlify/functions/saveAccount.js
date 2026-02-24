const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  try {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, error: 'Method not allowed' })
      }
    }

    const body = JSON.parse(event.body || "{}")
    const { user_id, name, type } = body

    // Basic validation
    if (!user_id || !name || !type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Missing fields' })
      }
    }

    const { error } = await supabase
      .from('accounts')
      .insert([
        {
          user_id,
          name,
          type
        }
      ])

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: error.message })
      }
    }

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
