import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const data = await request.json()

    const authHeader = request.headers.get('Authorization')
    let userId: string | null = null

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseAdmin.auth.getUser(token)
      userId = user?.id ?? null
    }

    const { data: client, error: dbError } = await supabaseAdmin
      .from('clients')
      .insert({
        user_id: userId,
        business_name: data.nombre_negocio,
        slug:
          data.nombre_negocio
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') +
          '-' +
          Date.now(),
        industry_type: data.sector,
        plan: data.plan?.toLowerCase() || 'profesional',
        status: 'intake_pending',
        preferred_contact: data.canal_contacto,
        whatsapp_number: data.whatsapp || null,
        intake_data: data,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
    }

    const emailHtml = buildEmailHtml(data)

    await resend.emails.send({
      from: 'Yele Studio <info@yele.design>',
      to: [process.env.STUDIO_EMAIL!, process.env.OWNER_EMAIL!],
      subject: `Nueva solicitud — ${data.nombre_negocio} (${data.sector})`,
      html: emailHtml,
    })

    if (data.email) {
      await resend.emails.send({
        from: 'Yele Studio <info@yele.design>',
        to: data.email,
        replyTo: 'info@yele.design',
        subject: `Hemos recibido tu solicitud — ${data.nombre_negocio}`,
        html: buildConfirmationHtml(data),
      })
    }

    return Response.json({ success: true, clientId: client?.id })
  } catch (error) {
    console.error('Intake error:', error)
    return Response.json({ error: 'Error procesando solicitud' }, { status: 500 })
  }
}

function buildEmailHtml(data: Record<string, unknown>): string {
  const row = (label: string, value: unknown) =>
    value
      ? `<tr>
          <td style="padding:8px 16px;font-size:12px;font-weight:600;color:#8A9BAD;text-transform:uppercase;letter-spacing:0.06em;width:160px;vertical-align:top;">${label}</td>
          <td style="padding:8px 16px;font-size:14px;color:#1E2B3A;vertical-align:top;">${Array.isArray(value) ? value.join(', ') : String(value)}</td>
        </tr>`
      : ''

  const section = (title: string, rows: string) =>
    `<div style="margin-bottom:24px;">
      <div style="background:#F5F2EE;padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8A9BAD;">${title}</div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #E8E4DF;">${rows}</table>
    </div>`

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F2EE;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#FFFFFF;">
  <div style="background:#1D1D1F;padding:24px 32px;">
    <span style="font-size:20px;font-weight:700;color:#FFFFFF;font-family:Georgia,serif;">yele</span>
    <span style="color:#34C759;font-size:20px;font-weight:700;">.design</span>
    <span style="color:#86868B;font-size:12px;margin-left:12px;">Nueva solicitud</span>
  </div>
  <div style="padding:28px 32px 8px;">
    <h1 style="margin:0;font-size:26px;color:#1D1D1F;font-family:Georgia,serif;font-weight:400;letter-spacing:-0.02em;">${data.nombre_negocio}</h1>
    <p style="margin:6px 0 0;font-size:14px;color:#86868B;">${data.sector} · ${data.ciudad}</p>
  </div>
  <div style="padding:16px 32px 32px;">
    ${section('Información del negocio',
      row('Nombre', data.nombre_negocio) +
      row('Sector', data.sector) +
      row('Ciudad', data.ciudad) +
      row('Dirección', data.direccion) +
      row('CIF / NIF', data.cif)
    )}
    ${section('Contacto',
      row('Nombre', data.nombre_contacto) +
      row('Teléfono', data.telefono) +
      row('Email', data.email) +
      row('Web actual', data.web_actual) +
      row('Contacto preferido', data.canal_contacto) +
      row('WhatsApp', data.whatsapp)
    )}
    ${section('El negocio',
      row('Descripción', data.descripcion) +
      row('Servicios', data.servicios) +
      row('Precio medio', data.precio_medio) +
      row('Horario', data.horario) +
      row('Años en negocio', data.anos_negocio)
    )}
    ${section('La web',
      row('Plan', data.plan) +
      row('Páginas', data.paginas) +
      row('Tiene logo', data.tiene_logo) +
      row('Tiene fotos', data.tiene_fotos) +
      row('Referencias', data.referencias) +
      row('Estilo visual', data.estilo_visual)
    )}
    ${section('Detalles',
      row('Cómo nos conoció', data.como_nos_conocio) +
      row('Notas', data.notas)
    )}
    <div style="text-align:center;margin-top:24px;">
      <a href="https://app.yele.design/admin" style="display:inline-block;background:#1D1D1F;color:#FFFFFF;font-weight:700;font-size:13px;padding:14px 32px;text-decoration:none;letter-spacing:0.04em;border-radius:8px;">
        Ver en panel de admin →
      </a>
    </div>
  </div>
  <div style="background:#F5F2EE;padding:16px 32px;font-size:11px;color:#86868B;text-align:center;border-top:1px solid #E8E4DF;">
    Yele Studio · yele.design · Solicitud recibida el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
  </div>
</div>
</body></html>`
}

function buildConfirmationHtml(data: Record<string, unknown>): string {
  const nombre = typeof data.nombre_negocio === 'string' ? data.nombre_negocio : ''
  const contacto = typeof data.nombre_contacto === 'string' ? data.nombre_contacto.split(' ')[0] : ''
  const canal = data.canal_contacto
  const whatsapp = data.whatsapp
  const telefono = data.telefono
  const email = data.email

  const contactLine =
    canal === 'WhatsApp' && whatsapp
      ? `por WhatsApp al ${whatsapp}`
      : canal === 'Teléfono' && telefono
      ? `por teléfono al ${telefono}`
      : `por email a ${email}`

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F5F7;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:#FFFFFF;">
  <div style="background:#1D1D1F;padding:24px 32px;">
    <span style="font-size:20px;font-weight:700;color:#FFFFFF;font-family:Georgia,serif;">yele</span>
    <span style="color:#34C759;font-size:20px;font-weight:700;">.design</span>
  </div>
  <div style="padding:32px;">
    <h1 style="margin:0 0 16px;font-size:24px;color:#1D1D1F;font-family:Georgia,serif;font-weight:400;">Hemos recibido tu solicitud.</h1>
    <p style="font-size:15px;color:#3D3D3D;line-height:1.65;margin:0 0 20px;">
      Hola${contacto ? ', ' + contacto : ''}. Gracias por confiar en Yele Studio para crear la web de <strong>${nombre}</strong>. Ya estamos trabajando en ello.
    </p>
    <div style="background:#F5F5F7;border-radius:8px;padding:20px;margin:0 0 24px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#86868B;margin-bottom:10px;">Próximos pasos</div>
      <div style="font-size:14px;color:#1D1D1F;line-height:1.7;">
        <div style="margin-bottom:8px;">① Revisamos tu solicitud en las próximas horas</div>
        <div style="margin-bottom:8px;">② Nos ponemos en contacto ${contactLine}</div>
        <div>③ Tu web estará lista en 3–5 días</div>
      </div>
    </div>
    <p style="font-size:13px;color:#86868B;line-height:1.6;margin:0 0 28px;">
      ¿Tienes alguna pregunta? Responde a este email o escríbenos a <a href="mailto:info@yele.design" style="color:#1D1D1F;">info@yele.design</a>
    </p>
    <a href="https://app.yele.design" style="display:inline-block;background:#1D1D1F;color:#FFFFFF;font-weight:700;font-size:13px;padding:14px 28px;text-decoration:none;border-radius:8px;">
      Acceder a mi panel →
    </a>
  </div>
  <div style="background:#F5F5F7;padding:14px 32px;font-size:11px;color:#86868B;border-top:1px solid #E5E5E5;">
    Yele Studio · yele.design
  </div>
</div>
</body></html>`
}
