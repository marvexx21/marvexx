const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  const user_id = event.queryStringParameters.user_id

  const { data, error } = await supabase
    .from('entry_references')
    .select('name')
    .eq('user_id', user_id)

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ references: data })
  }
}
