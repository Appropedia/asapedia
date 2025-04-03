const ASApedia = {

	init: function () {
		document.querySelectorAll( '#asapedia-main li' ).forEach( ASApedia.addArrow );
		document.querySelectorAll( '#asapedia-main li' ).forEach( ASApedia.toggleSublist );
		document.getElementById( 'asapedia-download-pdf' ).onclick = ASApedia.downloadPDF;
		document.getElementById( 'asapedia-download-zim' ).onclick = ASApedia.downloadZIM;
		window.onbeforeinstallprompt = ASApedia.enableInstallButton;
	},

	downloadZIM: function () {
		const pages = [];
		document.querySelectorAll( '#asapedia-list a' ).forEach( link => {
			const url = link.href;
			const page = url.replace( 'https://www.appropedia.org/', '' );
			pages.push( page );
		} );
		const params = new URLSearchParams( {
			title: 'ASApedia',
			icon: new URL( 'images/icon.png', document.baseURI ).href,
			pages: pages.join( ',' )
		} );
		const url = 'https://www.appropedia.org/scripts/downloadZIM.php?' + params.toString();
		window.location.href = url;
	},

	downloadPDF: function () {
		const pages = [];
		document.querySelectorAll( '#asapedia-list a' ).forEach( link => {
			const url = link.href;
			const page = url.replace( 'https://www.appropedia.org/', '' );
			pages.push( page );
		} );
		const params = new URLSearchParams( {
			title: 'ASApedia',
			subtitle: 'Por Catholic Relief Services',
			text: 'Buenas prácticas agrícolas para aumentar la productividad, sostenibilidad, resiliencia y prosperidad de las familias, los cultivos y las comunidades.',
			logo: new URL( 'images/logo.png', document.baseURI ).href,
			qrpage: 'https://www.appropedia.org/ASApedia',
			pages: pages.join( ',' )
		} );
		const url = 'https://www.appropedia.org/scripts/downloadPDF.php?' + params.toString();
		window.location.href = url;
	},

	enableInstallButton: function ( event ) {
		event.preventDefault();
		const button = document.getElementById( 'asapedia-install-app' );
		button.removeAttribute( 'hidden' );
		button.onclick = () => {
			event.prompt();
			button.setAttribute(  'hidden', '' );
		};
	},
	
	addArrow: function ( item ) {
		const sublist = item.querySelector( 'ul' );
		if ( sublist ) {
			const arrow = document.createElement( 'button' );
			arrow.classList.add( 'arrow' );
			arrow.innerHTML = '&#9658;';
			item.prepend( arrow );
		}
	},

	toggleSublist: function ( item ) {
		const sublist = item.querySelector( 'ul' );
		if ( sublist ) {
			item.onclick = event => {
				event.stopPropagation();
				const arrow = item.querySelector( 'button' );
				if ( sublist.style.display === '' ) {
					sublist.style.display = 'block';
					arrow.innerHTML = '&#9660;';
				} else {
					sublist.style.display = '';
					arrow.innerHTML = '&#9658;';
				}
			}
		}
	}
};

window.onload = ASApedia.init;