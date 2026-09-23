import Link from 'next/link';
import { LOJA, whatsappLink } from '@/lib/loja';
import { Logo } from './Logo';
import { IconClock, IconFacebook, IconInstagram, IconMail, IconPhone, IconPin, IconWhatsapp, IconYoutube } from './Icons';

export function Footer() {
  const tel = LOJA.telefone.replace(/\D/g, '');
  return (
    <footer className="footer" id="contato">
      <div className="container footer__grid" id="lojas">
        <div className="footer__brand">
          <Logo variant="light" />
          <div className="social">
            <a href={LOJA.redes.instagram} aria-label="Instagram" rel="noopener noreferrer"><IconInstagram /></a>
            <a href={LOJA.redes.facebook} aria-label="Facebook" rel="noopener noreferrer"><IconFacebook /></a>
            <a href={LOJA.redes.youtube} aria-label="YouTube" rel="noopener noreferrer"><IconYoutube /></a>
          </div>
        </div>

        <div>
          <h4 className="display footer__title">Links rápidos</h4>
          <ul className="footer__list footer__list--check">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#estoque">Estoque</Link></li>
            <li><Link href="/#lojas">Lojas</Link></li>
            <li><Link href="/#sobre">Sobre nós</Link></li>
            <li><Link href="/#contato">Contato</Link></li>
            <li>
              <a href={whatsappLink('Olá! Vim pelo site da MultiCar.')} target="_blank" rel="noopener noreferrer">
                Entre em contato
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="display footer__title">Contatos</h4>
          <ul className="footer__list footer__list--icons">
            <li><IconPhone /><a href={`tel:+55${tel}`}>{LOJA.telefone.replace(/[()]/g, '')}</a></li>
            <li><IconWhatsapp /><a href={`https://wa.me/${LOJA.whatsapp}`} target="_blank" rel="noopener noreferrer">{LOJA.whatsapp.slice(2)}</a></li>
            <li><IconMail /><a href={`mailto:${LOJA.email}`}>{LOJA.email}</a></li>
            <li><IconClock /><span>{LOJA.horarioTexto}</span></li>
            <li><IconPin /><span>{LOJA.endereco}</span></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>Multicar {new Date().getFullYear()} - Todos os direitos reservados | Desenvolvido por Agência Mais Art</p>
      </div>
    </footer>
  );
}
