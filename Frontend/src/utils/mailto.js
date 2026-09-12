export function buildReplyMailto(message) {
  const subject = `Re: Mensagem via portfólio — ${message.name}`;
  const body = [
    '',
    `Olá ${message.name},`,
    '',
    'Recebi sua mensagem e escrevo de volta por aqui:',
    '',
    '—',
    `Sua mensagem original:`,
    '',
    message.message,
    '—',
    '',
    `Atenciosamente,`,
    `Bruno Celestino`,
  ].join('\n');

  return `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}