const ASApedia = {

	init: function () {
		document.querySelectorAll( '#asapedia-main li' ).forEach( ASApedia.addArrow );
		document.querySelectorAll( '#asapedia-main li' ).forEach( ASApedia.toggleSublist );
		document.getElementById( 'asapedia-download-pdf' ).onclick = ASApedia.downloadPDF;
		document.getElementById( 'asapedia-download-zim' ).onclick = ASApedia.downloadZIM;
		window.onbeforeinstallprompt = ASApedia.enableInstallButton;
	},

	downloadZIM: async function () {

		// Disable the button to prevent multiple clicks and hint the user that something is happening
		const button = this;
		const buttonText = button.textContent;
		button.textContent = 'Generating...';
		button.style.pointerEvents = 'none';

		// Get the titles of the pages
		const pages = [];
		document.querySelectorAll( '#asapedia-list a' ).forEach( link => {
			const url = link.href;
			const page = url.replace( 'https://www.appropedia.org/', '' );
			pages.push( page );
		} );

		// Build the query
		const query = {
			title: 'ASApedia',
			description: 'Buenas prácticas agrícolas',
			mainpage: 'ASApedia',
			icon: new URL( 'images/icon.png', document.baseURI ).href,
			pages: pages.join( ',' )
		};
		const queryString = new URLSearchParams( query ).toString();
		const url = 'https://www.appropedia.org/scripts/generateZIM.php?' + queryString;

		// Generate the ZIM
		const result = await fetch( url );
		const bytes = await result.arrayBuffer();

		// Download the ZIM
		const blob = new Blob( [ bytes ], { type: 'application/octet-stream' } );
		const href = URL.createObjectURL( blob );
		const a = document.createElement( 'a' );
		a.href = href;
		a.download = 'asapedia.zim';
		document.body.appendChild( a );
		a.click();
		document.body.removeChild( a );
		URL.revokeObjectURL( href );

		// Re-enable the button
		button.textContent = buttonText;
		button.style.pointerEvents = '';
	},

	downloadPDF: async function () {

		// Disable the button to prevent multiple clicks and hint the user that something is happening
		const button = this;
		const buttonText = button.textContent;
		button.textContent = 'Generating...';
		button.style.pointerEvents = 'none';

		// Get the titles of the pages
		const pages = [];
		document.querySelectorAll( '#asapedia-list a' ).forEach( link => {
			const url = link.href;
			const page = url.replace( 'https://www.appropedia.org/', '' );
			pages.push( page );
		} );

		// Build the query
		const query = {
			title: 'ASApedia',
			subtitle: 'Por Catholic Relief Services',
			text: 'Buenas prácticas agrícolas para aumentar la productividad, sostenibilidad, resiliencia y prosperidad de las familias, los cultivos y las comunidades.',
			logo: new URL( 'images/logo.png', document.baseURI ).href,
			qrpage: 'https://www.appropedia.org/ASApedia',
			pages: pages.join( ',' )
		};
		const queryString = new URLSearchParams( query ).toString();
		const url = 'https://www.appropedia.org/scripts/generatePDF.php?' + queryString;

		// Generate the PDF
		const result = await fetch( url );
		const bytes = await result.arrayBuffer();

		// Download the PDF
		const blob = new Blob( [ bytes ], { type: 'application/pdf' } );
		const href = URL.createObjectURL( blob );
		const a = document.createElement( 'a' );
		a.href = href;
		a.download = 'asapedia.pdf';
		document.body.appendChild( a );
		a.click();
		document.body.removeChild( a );
		URL.revokeObjectURL( href );

		// Re-enable the button
		button.textContent = buttonText;
		button.style.pointerEvents = '';
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
				if ( event.target.tagName === 'A' ) {
					return;
				}
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