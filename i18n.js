(() => {
  const supported = ['de','en','fr','es'];
  const labels = {de:'DE',en:'EN',fr:'FR',es:'ES'};
  const T = {
    de: {
      'Welcome.':'Willkommen.','Your table is ready.':'Ihr Tisch ist bereit.','Enter':'Eintreten',
      'Now serving:':'Jetzt serviert:','View the collection':'Kollektion ansehen','The House':'Das Haus','Reservations':'Reservations','Atlas':'Atlas','Listening Lounge':'Listening Lounge','Share':'Teilen','Partner Lounge':'Partner Lounge','Press Room':'Pressebereich','Media Kit':'Media-Kit','Guest List':'Gästeliste',
      'Luxury Dining Soundtracks':'Luxuriöse Dinner-Soundtracks','Every Reservation is a destination.':'Jede Reservation ist ein Reiseziel.','Enter The House':'Das Haus betreten','Discover':'Entdecken',
      'A house built around atmosphere.':'Ein Haus, geschaffen für Atmosphäre.','The Seventh Table is a destination for music, hospitality and carefully chosen collaborations.':'The Seventh Table ist ein Ort für Musik, Gastlichkeit und sorgfältig ausgewählte Kooperationen.',
      'Every memorable evening begins long before the first course is served. It begins with atmosphere: a quiet conversation, candlelight, the sound of glasses meeting and music that never asks for attention, yet changes everything.':'Jeder unvergessliche Abend beginnt lange vor dem ersten Gang. Er beginnt mit Atmosphäre: einem leisen Gespräch, Kerzenlicht, dem Klang anstoßender Gläser und Musik, die nie Aufmerksamkeit verlangt und dennoch alles verändert.',
      'The Seventh Table was created from a simple belief: music should not dominate a room. It should define its soul.':'The Seventh Table entstand aus einer einfachen Überzeugung: Musik soll einen Raum nicht beherrschen. Sie soll seine Seele prägen.',
      'Each Reservation represents a destination — remembered not only for its cuisine, but for the feeling it leaves behind. The House brings those destinations together for listeners, restaurants, hotels, press and selected partners.':'Jede Reservation steht für ein Reiseziel – in Erinnerung nicht nur wegen seiner Küche, sondern wegen des Gefühls, das es hinterlässt. Das Haus vereint diese Orte für Hörer, Gastronomie, Hotels, Presse und ausgewählte Partner.',
      'Discover the collection':'Die Kollektion entdecken','Enter the collaboration room':'Den Raum der Zusammenarbeit betreten','Media enquiries and information':'Medienanfragen und Informationen','Approved brand materials':'Freigegebene Markenmaterialien','Welcome to The House. Your table has already been prepared.':'Willkommen im Haus. Ihr Tisch ist bereits vorbereitet.',
      'Next Service':'Nächster Service','The next Reservation approaches.':'Die nächste Reservation naht.','13 July 2026 · The journey begins':'13. Juli 2026 · Die Reise beginnt','Days':'Tage','Hours':'Stunden','Minutes':'Minuten','Seconds':'Sekunden',
      'Featured Reservation':'Ausgewählte Reservation','Warm rhythms, candlelight and the timeless elegance of an unforgettable Argentine evening.':'Warme Rhythmen, Kerzenlicht und die zeitlose Eleganz eines unvergesslichen argentinischen Abends.','Reserve & Listen':'Reservieren & anhören','A growing collection of destinations.':'Eine wachsende Kollektion von Reisezielen.',
      'The Reservation Atlas':'Der Reservation-Atlas','Ten destinations.\nOne living atlas.':'Zehn Reiseziele.\nEin lebendiger Atlas.','A living atlas of the cities, courtyards and evenings that shaped the collection. Each golden point marks a Reservation and the atmosphere behind it.':'Ein lebendiger Atlas der Städte, Höfe und Abende, die diese Kollektion geprägt haben. Jeder goldene Punkt markiert eine Reservation und die Atmosphäre dahinter.',
      'The Listening Lounge':'Die Listening Lounge','Dim the lights.\nPour a glass.\nPress play.':'Licht dimmen.\nEin Glas einschenken.\nPlay drücken.','The Seventh Table is composed for the space between conversation and silence — present enough to shape the room, restrained enough to let the evening remain yours.':'The Seventh Table ist für den Raum zwischen Gespräch und Stille komponiert – präsent genug, um den Raum zu prägen, zurückhaltend genug, damit der Abend Ihnen gehört.','Enter the Lounge':'Die Lounge betreten','Explore all Reservations':'Alle Reservations entdecken','Best experienced after sunset.':'Am besten nach Sonnenuntergang erleben.',
      'Share The Table':'Teilen Sie den Tisch','Invite someone to take a seat.':'Laden Sie jemanden ein, Platz zu nehmen.','Share The Seventh Table with friends, restaurants, hotels and everyone who believes atmosphere matters.':'Teilen Sie The Seventh Table mit Freunden, Restaurants, Hotels und allen, die an die Bedeutung von Atmosphäre glauben.','Current invitation':'Aktuelle Einladung','Luxury dining soundtracks inspired by unforgettable places.':'Luxuriöse Dinner-Soundtracks, inspiriert von unvergesslichen Orten.','Share invitation':'Einladung teilen','Share on X':'Auf X teilen','Copy link':'Link kopieren',
      'The Partner Lounge':'Die Partner Lounge','Selected company. Shared standards.':'Ausgewählte Gesellschaft. Gemeinsame Maßstäbe.','A private room for hotels, restaurants, wine houses, design studios and brands that believe atmosphere is part of the experience.':'Ein privater Raum für Hotels, Restaurants, Weinhäuser, Designstudios und Marken, die Atmosphäre als Teil des Erlebnisses verstehen.','Fine Dining':'Fine Dining','Luxury Hotels':'Luxushotels','Wine Houses':'Weinhäuser','Interior Design':'Interior Design','Request access to the Lounge':'Zugang zur Lounge anfragen','Partnerships are intentionally limited. Every request is reviewed personally and selected for long-term fit, quality and authenticity.':'Partnerschaften sind bewusst limitiert. Jede Anfrage wird persönlich geprüft und nach langfristiger Passung, Qualität und Authentizität ausgewählt.','Submit a Partnership Request':'Partnerschaft anfragen',
      'Stories, interviews and media enquiries.':'Geschichten, Interviews und Medienanfragen.','For journalists, editors, broadcasters and cultural media.':'Für Journalisten, Redaktionen, Rundfunk und Kulturmedien.','Enter the Press Room →':'Pressebereich betreten →','Approved assets from The House.':'Freigegebene Materialien aus dem Haus.','Brand information, imagery and official contact details.':'Markeninformationen, Bildmaterial und offizielle Kontaktdaten.','Open the Media Kit →':'Media-Kit öffnen →',
      'Private Invitation':'Private Einladung','Some evenings begin before they are announced.':'Manche Abende beginnen, bevor sie angekündigt werden.','Members of the Guest List receive selected previews, early invitations and news from The House before each new Reservation is served publicly.':'Mitglieder der Gästeliste erhalten ausgewählte Vorschauen, frühe Einladungen und Neuigkeiten aus dem Haus, bevor jede neue Reservation öffentlich serviert wird.','Reserve Your Seat':'Reservieren Sie Ihren Platz','The Table Awaits':'Der Tisch wartet','Receive invitations to every new Reservation before anyone else.':'Erhalten Sie Einladungen zu jeder neuen Reservation vor allen anderen.','Your email address':'Ihre E-Mail-Adresse','Join the Guest List':'Der Gästeliste beitreten','I agree to receive invitations and news from The Seventh Table. I can unsubscribe at any time.':'Ich stimme zu, Einladungen und Neuigkeiten von The Seventh Table zu erhalten. Ich kann mich jederzeit abmelden.','Privacy':'Datenschutz','No noise. No daily mail. Only new Reservations and selected invitations.':'Kein Lärm. Keine täglichen Mails. Nur neue Reservations und ausgewählte Einladungen.','Legal':'Impressum','Until the next reservation...':'Bis zur nächsten Reservation …',
      'Herunterladbare digitale Musik':'Herunterladbare digitale Musik',
      'Warm rhythms, candlelight and the timeless elegance of an unforgettable Argentine evening.':'Warme Rhythmen, Kerzenlicht und die zeitlose Eleganz eines unvergesslichen argentinischen Abends.',
      'An intimate courtyard where East meets West, filled with history, conversation and quiet emotion.':'Ein intimer Innenhof, in dem Ost und West aufeinandertreffen – erfüllt von Geschichte, Gesprächen und leiser Emotion.',
      'Golden lanterns, aromatic spices and the hypnotic atmosphere of a Moroccan evening.':'Goldene Laternen, aromatische Gewürze und die hypnotische Atmosphäre eines marokkanischen Abends.',
      'Where Europe and Asia meet beneath shimmering lights and endless conversations.':'Wo Europa und Asien unter schimmernden Lichtern und endlosen Gesprächen zusammentreffen.',
      'Peaceful elegance inspired by Japanese gardens, silence and timeless beauty.':'Ruhige Eleganz, inspiriert von japanischen Gärten, Stille und zeitloser Schönheit.',
      'Sunlit terraces, Atlantic breezes and relaxed afternoons overlooking the old city.':'Sonnige Terrassen, Atlantikbrisen und entspannte Nachmittage mit Blick über die Altstadt.',
      'A warm Mediterranean evening filled with wine, laughter and golden sunsets.':'Ein warmer mediterraner Abend voller Wein, Lachen und goldener Sonnenuntergänge.',
      'White architecture, blue horizons and the calm of the Aegean Sea at dusk.':'Weiße Architektur, blaue Horizonte und die Ruhe der Ägäis in der Dämmerung.',
      'Classic Parisian charm, intimate conversations and timeless elegance.':'Klassischer Pariser Charme, vertraute Gespräche und zeitlose Eleganz.',
      'Where the journey began. Slow evenings, fine cuisine and unforgettable sunsets.':'Wo die Reise begann. Langsame Abende, feine Küche und unvergessliche Sonnenuntergänge.'
    },
    fr: {
      'Welcome.':'Bienvenue.','Your table is ready.':'Votre table est prête.','Enter':'Entrer','Now serving:':'Actuellement servi :','View the collection':'Voir la collection','The House':'La Maison','Reservations':'Réservations','Atlas':'Atlas','Listening Lounge':'Salon d’écoute','Share':'Partager','Partner Lounge':'Salon des partenaires','Press Room':'Espace presse','Media Kit':'Kit média','Guest List':'Liste des invités','Luxury Dining Soundtracks':'Bandes-son de dîner de luxe','Every Reservation is a destination.':'Chaque Réservation est une destination.','Enter The House':'Entrer dans la Maison','Discover':'Découvrir','A house built around atmosphere.':'Une maison construite autour de l’atmosphère.','The Seventh Table is a destination for music, hospitality and carefully chosen collaborations.':'The Seventh Table est une destination dédiée à la musique, à l’hospitalité et à des collaborations soigneusement choisies.','Discover the collection':'Découvrir la collection','Enter the collaboration room':'Entrer dans l’espace de collaboration','Media enquiries and information':'Demandes médias et informations','Approved brand materials':'Éléments de marque approuvés','Welcome to The House. Your table has already been prepared.':'Bienvenue dans la Maison. Votre table est déjà préparée.','Next Service':'Prochain service','The next Reservation approaches.':'La prochaine Réservation approche.','13 July 2026 · The journey begins':'13 juillet 2026 · Le voyage commence','Days':'Jours','Hours':'Heures','Minutes':'Minutes','Seconds':'Secondes','Featured Reservation':'Réservation à l’honneur','Reserve & Listen':'Réserver et écouter','A growing collection of destinations.':'Une collection grandissante de destinations.','The Reservation Atlas':'L’Atlas des Réservations','The Listening Lounge':'Le Salon d’écoute','Enter the Lounge':'Entrer dans le Salon','Explore all Reservations':'Explorer toutes les Réservations','Best experienced after sunset.':'À savourer de préférence après le coucher du soleil.','Share The Table':'Partager la Table','Invite someone to take a seat.':'Invitez quelqu’un à prendre place.','Share invitation':'Partager l’invitation','Share on X':'Partager sur X','Copy link':'Copier le lien','The Partner Lounge':'Le Salon des partenaires','Selected company. Shared standards.':'Compagnie choisie. Exigences partagées.','Luxury Hotels':'Hôtels de luxe','Wine Houses':'Maisons de vin','Request access to the Lounge':'Demander l’accès au Salon','Submit a Partnership Request':'Soumettre une demande de partenariat','Private Invitation':'Invitation privée','Some evenings begin before they are announced.':'Certaines soirées commencent avant même d’être annoncées.','Reserve Your Seat':'Réserver votre place','The Table Awaits':'La Table vous attend','Receive invitations to every new Reservation before anyone else.':'Recevez les invitations à chaque nouvelle Réservation avant tout le monde.','Your email address':'Votre adresse e-mail','Join the Guest List':'Rejoindre la liste des invités','Privacy':'Confidentialité','Legal':'Mentions légales','Until the next reservation...':'Jusqu’à la prochaine Réservation…'
    },
    es: {
      'Welcome.':'Bienvenido.','Your table is ready.':'Su mesa está lista.','Enter':'Entrar','Now serving:':'Ahora se sirve:','View the collection':'Ver la colección','The House':'La Casa','Reservations':'Reservas','Atlas':'Atlas','Listening Lounge':'Salón de escucha','Share':'Compartir','Partner Lounge':'Salón de socios','Press Room':'Sala de prensa','Media Kit':'Kit de prensa','Guest List':'Lista de invitados','Luxury Dining Soundtracks':'Bandas sonoras para cenas de lujo','Every Reservation is a destination.':'Cada Reserva es un destino.','Enter The House':'Entrar en La Casa','Discover':'Descubrir','A house built around atmosphere.':'Una casa construida alrededor de la atmósfera.','The Seventh Table is a destination for music, hospitality and carefully chosen collaborations.':'The Seventh Table es un destino para la música, la hospitalidad y colaboraciones cuidadosamente seleccionadas.','Discover the collection':'Descubrir la colección','Enter the collaboration room':'Entrar en la sala de colaboración','Media enquiries and information':'Consultas de prensa e información','Approved brand materials':'Materiales de marca aprobados','Welcome to The House. Your table has already been prepared.':'Bienvenido a La Casa. Su mesa ya está preparada.','Next Service':'Próximo servicio','The next Reservation approaches.':'La próxima Reserva se acerca.','13 July 2026 · The journey begins':'13 de julio de 2026 · Comienza el viaje','Days':'Días','Hours':'Horas','Minutes':'Minutos','Seconds':'Segundos','Featured Reservation':'Reserva destacada','Reserve & Listen':'Reservar y escuchar','A growing collection of destinations.':'Una colección creciente de destinos.','The Reservation Atlas':'El Atlas de Reservas','The Listening Lounge':'El Salón de escucha','Enter the Lounge':'Entrar en el Salón','Explore all Reservations':'Explorar todas las Reservas','Best experienced after sunset.':'Mejor después del atardecer.','Share The Table':'Compartir la Mesa','Invite someone to take a seat.':'Invite a alguien a tomar asiento.','Share invitation':'Compartir invitación','Share on X':'Compartir en X','Copy link':'Copiar enlace','The Partner Lounge':'El Salón de socios','Selected company. Shared standards.':'Compañía selecta. Estándares compartidos.','Luxury Hotels':'Hoteles de lujo','Wine Houses':'Bodegas','Request access to the Lounge':'Solicitar acceso al Salón','Submit a Partnership Request':'Enviar solicitud de colaboración','Private Invitation':'Invitación privada','Some evenings begin before they are announced.':'Algunas veladas comienzan antes de ser anunciadas.','Reserve Your Seat':'Reserve su asiento','The Table Awaits':'La Mesa le espera','Receive invitations to every new Reservation before anyone else.':'Reciba invitaciones para cada nueva Reserva antes que nadie.','Your email address':'Su correo electrónico','Join the Guest List':'Unirse a la lista de invitados','Privacy':'Privacidad','Legal':'Aviso legal','Until the next reservation...':'Hasta la próxima Reserva…'
    }
  };


  const EXTRA = {
    de: {
      'Partnerships':'Partnerschaften',
      'Selected collaborations':'Ausgewählte Kooperationen',
      'Request an Invitation':'Einladung anfragen',
      'Let us create something memorable.':'Lassen Sie uns etwas Bleibendes schaffen.',
      'We welcome thoughtful enquiries from restaurants, hotels, wine houses, premium venues and brands that share our appreciation for atmosphere, quality and lasting experiences.':'Wir freuen uns über sorgfältig formulierte Anfragen von Restaurants, Hotels, Weinhäusern, Premium-Locations und Marken, die unsere Wertschätzung für Atmosphäre, Qualität und bleibende Erlebnisse teilen.',
      'Name':'Name',
      'Company / Venue':'Unternehmen / Location',
      'Email':'E-Mail',
      'Website':'Website',
      'Location':'Ort',
      'Partnership type':'Art der Partnerschaft',
      'Select':'Bitte wählen',
      'Hospitality':'Hospitality',
      'Brand collaboration':'Markenkooperation',
      'Sponsorship':'Sponsoring',
      'Event':'Veranstaltung',
      'Other':'Sonstiges',
      'Tell us about your idea':'Erzählen Sie uns von Ihrer Idee',
      'I agree that my information may be used to review and respond to this enquiry.':'Ich stimme zu, dass meine Angaben zur Prüfung und Beantwortung dieser Anfrage verwendet werden dürfen.',
      'Send Partnership Request':'Partnerschaftsanfrage senden',
      'Licensing':'Lizenzierung',
      'Press':'Presse',
      'Imprint':'Impressum'
    },
    fr: {
      'Partnerships':'Partenariats',
      'Selected collaborations':'Collaborations sélectionnées',
      'Request an Invitation':'Demander une invitation',
      'Let us create something memorable.':'Créons ensemble quelque chose d’inoubliable.',
      'We welcome thoughtful enquiries from restaurants, hotels, wine houses, premium venues and brands that share our appreciation for atmosphere, quality and lasting experiences.':'Nous accueillons les demandes réfléchies de restaurants, hôtels, maisons de vin, lieux d’exception et marques qui partagent notre goût pour l’atmosphère, la qualité et les expériences durables.',
      'Name':'Nom',
      'Company / Venue':'Entreprise / Établissement',
      'Email':'E-mail',
      'Website':'Site web',
      'Location':'Lieu',
      'Partnership type':'Type de partenariat',
      'Select':'Sélectionner',
      'Hospitality':'Hospitalité',
      'Brand collaboration':'Collaboration de marque',
      'Sponsorship':'Parrainage',
      'Event':'Événement',
      'Other':'Autre',
      'Tell us about your idea':'Parlez-nous de votre idée',
      'I agree that my information may be used to review and respond to this enquiry.':'J’accepte que mes informations soient utilisées pour étudier cette demande et y répondre.',
      'Send Partnership Request':'Envoyer la demande de partenariat',
      'Licensing':'Licences',
      'Press':'Presse',
      'Imprint':'Mentions légales'
    },
    es: {
      'Partnerships':'Colaboraciones',
      'Selected collaborations':'Colaboraciones seleccionadas',
      'Request an Invitation':'Solicitar una invitación',
      'Let us create something memorable.':'Creemos juntos algo memorable.',
      'We welcome thoughtful enquiries from restaurants, hotels, wine houses, premium venues and brands that share our appreciation for atmosphere, quality and lasting experiences.':'Recibimos con interés las consultas de restaurantes, hoteles, bodegas, espacios premium y marcas que comparten nuestro aprecio por la atmósfera, la calidad y las experiencias duraderas.',
      'Name':'Nombre',
      'Company / Venue':'Empresa / Espacio',
      'Email':'Correo electrónico',
      'Website':'Sitio web',
      'Location':'Ubicación',
      'Partnership type':'Tipo de colaboración',
      'Select':'Seleccionar',
      'Hospitality':'Hospitalidad',
      'Brand collaboration':'Colaboración de marca',
      'Sponsorship':'Patrocinio',
      'Event':'Evento',
      'Other':'Otro',
      'Tell us about your idea':'Cuéntenos su idea',
      'I agree that my information may be used to review and respond to this enquiry.':'Acepto que mis datos se utilicen para revisar y responder a esta consulta.',
      'Send Partnership Request':'Enviar solicitud de colaboración',
      'Licensing':'Licencias',
      'Press':'Prensa',
      'Imprint':'Aviso legal'
    }
  };

  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const textAttrs = ['placeholder','aria-label','title','data-default-label','data-loading-label'];
  let lang = localStorage.getItem('tst-language') || ((navigator.language || 'en').slice(0,2));
  if (!supported.includes(lang)) lang = 'en';

  function translateString(value, target) {
    const clean = value.trim();
    if (!clean || target === 'en') return value;
    if (BRAND_TERMS.includes(clean)) return;
    const translated = T[target]?.[clean] || EXTRA[target]?.[clean];
    if (!translated) return value;
    const lead = value.match(/^\s*/)?.[0] || '';
    const trail = value.match(/\s*$/)?.[0] || '';
    return lead + translated + trail;
  }

  function translateNode(root=document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.parentElement || ['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!originalText.has(node)) originalText.set(node,node.nodeValue);
      const source=originalText.get(node);
      node.nodeValue = lang === 'en' ? source : translateString(source,lang);
    });
    root.querySelectorAll?.('*').forEach(el => {
      if (!originalAttrs.has(el)) originalAttrs.set(el,{});
      const store=originalAttrs.get(el);
      textAttrs.forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        if (!(attr in store)) store[attr]=el.getAttribute(attr);
        el.setAttribute(attr, lang==='en' ? store[attr] : translateString(store[attr],lang));
      });
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-lang-choice]').forEach(b=>b.classList.toggle('is-active',b.dataset.langChoice===lang));
    document.querySelectorAll('[data-language-current]').forEach(e=>e.textContent=labels[lang]);
  }

  function setLanguage(next) {
    if (!supported.includes(next)) return;
    lang=next; localStorage.setItem('tst-language',lang); translateNode();
    window.dispatchEvent(new CustomEvent('tst:languagechange',{detail:{language:lang}}));
  }

  function buildControls() {
    // V17.2: no language-selection block on the luxury entrance.
    // The first visit follows the browser language automatically.
    // A deliberate user selection is preserved in localStorage.
    document.querySelectorAll('.language-choices').forEach((element) => element.remove());

    const header=document.querySelector('.site-header');
    if (header && !header.querySelector('.language-switcher')) {
      const sw=document.createElement('div'); sw.className='language-switcher';
      sw.innerHTML='<button type="button" data-language-current aria-label="Change language">EN</button><div class="language-menu"><button data-lang-choice="de">DE</button><button data-lang-choice="en">EN</button><button data-lang-choice="fr">FR</button><button data-lang-choice="es">ES</button></div>';
      header.appendChild(sw);
    }
    document.addEventListener('click',e=>{
      const btn=e.target.closest('[data-lang-choice]'); if(btn) setLanguage(btn.dataset.langChoice);
      const current=e.target.closest('[data-language-current]'); if(current) current.closest('.language-switcher')?.classList.toggle('is-open');
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    buildControls(); translateNode();
    const observer=new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1) translateNode(n); })));
    observer.observe(document.body,{childList:true,subtree:true});
  });
  window.TST_I18N={setLanguage,getLanguage:()=>lang,translate:()=>translateNode()};
})();
