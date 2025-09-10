// ==UserScript==
// @name         EC Certificate Downloader Loop with Persistent SRO & Year + Watchdog
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Loop download EC certificates by document range with retry for captcha, persistent SRO & Year settings
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /* ========================
       SRO LIST (cleaned names)
    ========================= */
    const sroList = [
        "Aandimadam", "Aathur_Dindugal", "Aathur_Salem East", "Abiramam", "Acchirapakkam", "Adayar",
    "Adhiramapattinam", "Alandur", "Alanganallur", "Alangudi", "Alangulam", "Alwarthirunagari",
    "Ambasamudhiram", "Ambattur", "Ambur", "Ammapettai_Erode", "Ammapettai_Nagapattinam_Closed",
    "Ammapettai-Thanjavur", "Anaimalai", "Ananthapuram", "Andipatti", "AnnaNagar", "Annavasal",
    "Anniyur", "Annur", "Anthiyur", "Aragandanallur", "Arakkonam", "Arakonam Joint I Closed",
    "Arakonam Joint II closed", "Arani_Cheyyar", "Arani_Tiruvallur", "Aranthangi", "Aravakurichi",
    "Arcot", "Ariyalur Joint I", "Ariyalur Joint II Closed", "Arumanai", "Aruppukkottai",
    "Ashok Nagar", "Avadi", "Avaloorpettai", "Avalpoondurai", "Avarapakkam", "Avinasi",
    "Ayothiyapattinam", "Ayyampalayam", "Ayyampettai", "Bagalur", "Bargur", "Barur", "Bhavani",
    "Bhuvanagiri", "Bodinayakkanur", "Boghalur", "Boothalur", "Boothapandi", "Brahmadesam_Closed",
    "Burkitmanagaram", "Chathirapatti", "Chekkanoorani", "CHELLAMPATTI", "Chembanarkovil", "Chengam",
    "Chengleput Joint I", "Chengleput Joint II", "Chennai Central_Chennai North Joint I",
    "Chennai Central Joint I", "Chennai Central Joint II", "Chennai North Joint I",
    "Chennai South_Chennai North Joint I", "Chennai South Joint I", "Chennai South Joint II",
    "Chennimalai", "Cheranmahadevi Joint I", "Cheranmahadevi Joint II", "Chetput", "Chettikulam",
    "Chettikulam(Madurai North)", "Cheyyar Joint I", "Cheyyar Joint II", "Cheyyur",
    "Chidambaram Joint I", "Chinnadarapuram", "Chinnalapatti", "Chinnamanur", "Chinna selam",
    "Chittamur_Closed", "Cholavanthan", "Coimbatore Joint II - Closed", "Coimbatore North Joint 1",
    "Coimbatore South Joint 1", "Coonoor_Uthagamandalam", "Coonoor_virudhunagar", "Cuddalore Joint I",
    "Cuddalore Joint II", "Cumbum", "Dadagapatti", "Desur_Closed", "Devakkottai", "Devigapuram_Closed",
    "Dharapuram", "Dharmapuri Joint I", "Dharmapuri Joint II", "Dharmapuri(West)", "Dindivanam Joint I",
    "Dindivanam Joint II", "Dindugal Joint I", "Dindugal Joint II", "Dusi", "Edapadi",
    "Edayakottai(camp)_Closed", "Elavanasur", "Endiyur_Closed", "Eral", "Erandampulikadu", "Eranial",
    "Eriyodu_Closed", "Erode Joint I", "Erumaipatti", "Erumbulikurichi", "Ettayapuram", "Ezhumalai",
    "Ganapathy", "Gandhipuram", "Gangaikondan", "Gangavalli", "Gingee", "Gobichettipalayam Joint I",
    "Gobichettipalayam Joint II", "Gomangalam", "Goodaloor", "Gooduvancheri", "Gummidipoondi",
    "Guruvarajapettai_Closed", "Harur", "Hozur", "Idaikkal", "Idalagudi", "Ilayangudi", "Iluppur",
    "Jalakandapuram", "Jayakondam", "Jolarpettai", "Kadaiyampatty", "Kadaladi_Ramanathapuram",
    "Kadaladi_Thiruvannamalai", "Kadamalaikundu", "Kadambur", "Kadampuliyur", "Kadathur", "Kadayam",
    "Kadayanallur", "Kalakkadu", "Kalampur", "Kalasapakkam", "Kalavai", "Kalayarkoil",
    "Kalingappatti(camp)_Closed", "Kallakurichi Joint I", "Kallakurichi Joint II", "Kallidaikurichi",
    "Kallikudi", "Kallimandayam", "Kalugumalai", "Kammapuram", "Kamudhi", "Kanakiliyanallur",
    "Kanchipuram Joint I", "Kanchipuram Joint II", "Kanchipuram Joint IV", "Kandamangalam",
    "Kangeyam", "Kaniyampadi", "Kaniyur", "Kannamangalam", "Kannivadi", "Kantharvakottai",
    "Kanyakumari Joint I", "Karaikudi Joint II", "Karakudi Joint I", "Karambakudi", "Kariapatti",
    "Karimangalam", "Karivalamvandanallur", "Karumathampatti", "Karungal", "Karungalakkudi",
    "Karunthattankudi", "KARUPPAYOORANI", "Karur Joint I", "Karur Joint II", "Kathakkinaru", "Katpadi",
    "Kattuputhur", "Kaveripakkam", "Kaveripattinam", "Kavundapadi", "Kayalpattinam", "Kayathar",
    "Keelakkarai", "Keelanilai", "KeelaRajakularaman", "Keeramangalam", "Keeranur", "Keezhaapazhur",
    "Keezhsathanur", "Keezhur", "Keezh Vazhi ThunaiyanKuppam", "Kelamangalam", "Kelampakkam",
    "Kilkodungalur", "Kilpennathur", "Kinathukkadavu", "Kodaikkanal", "Kodambakkam", "Kodavasal",
    "Kodumudi", "Kolakkanatham", "Kolathur", "Kolathur(camp)", "Kollankodu", "Kollidam",
    "Kolli Hills(Camp)", "Kommadikottai", "Konnur", "Koothanalur", "Kothagiri", "Kottaram", "Kovilpatii",
    "Krishnagiri Joint I", "Krishnagiri Joint II", "Krishnarayapuram", "Kudiyatham", "Kujiliamparai",
    "Kulatchal", "Kulithalai", "Kullanchavadi", "Kumarachi", "Kumarapalayam", "Kumbakonam Joint I",
    "Kunnathur", "Kunrathur", "Kurinchi padi", "Kurumbur_Closed", "Kuthalam", "Lalkudi", "Madakkupatti",
    "Madhavaram", "Madukkarai", "Madukkur", "Madurai North Joint I", "Madurai South Joint 4",
    "Madurai South Joint I", "Madurandakam", "Magudanchavadi", "Makarnonbuchavadi", "Mallasamuthiram",
    "Manalmedu_Closed", "Manalurpettai", "Manamadurai", "Manamelkudi", "Manaparai", "Manavalakurichi",
    "Manavalanagar", "Mangalam", "Mangalamapettai", "Mannachanallur", "Mannargudi", "Mannarkudi",
    "Marakkanam", "Marandahalli", "Marthandam Joint I", "Marthandam Joint II", "Mayiladuthurai Joint I",
    "Mayiladuthurai Joint II", "Mayilam", "Mecheri", "Meemisal", "Meensurutti", "Meignanapuram_Closed",
    "Melakarur", "Melaneelithanallur", "Melapapalayam", "Melattur_Closed", "Melauzhavur_Closed",
    "Melur - Closed", "Melur(East)", "Melur_Tuticorin", "Melur(West)", "Mettupalayam", "Mettur",
    "Moganur", "Moolakaraipatti", "Moolanur", "Morapur", "M.Rettiyapetty", "Mudhukulathur", "Mukkoodal",
    "Munchirai", "Murapanadu", "Musiri", "Muthialpet_Chennai North Joint I", "Muthupettai", "Mylapore",
    "Nachiyarkovil", "Nagalapuram_Closed", "Nagal nayakkampatti", "Nagalur", "NAGAMALAI PUDUKOTTAI",
    "Nagapatinam Joint I", "Nagoor", "Nallur_Namakkal_Closed", "Nallur_Tiruppur", "Nallur_Virudhachalam",
    "Namagiripettai", "Namakkal Joint I", "Namakkal Joint II", "Nambiyur", "Nangavaram", "Nanguneri",
    "Nannilam", "Natham", "Natrampalli", "Navalur", "Nayinar kovil", "Nazareth", "Needamangalam",
    "Neelankarai", "Negamam", "Nellikuppam", "Nemili", "Nilakkottai", "Odugathur", "Omalur", "Oorathur_Closed",
    "Oothangaalmangalam - Closed", "Oothangarai", "Oothukkottai", "Orathanadu", "Othakadai - Closed",
    "Ottanchathiram", "Ottapidaram", "Padappai", "Padukapathu (camp)_Closed", "Palacode", "Palani Joint I",
    "Palani Joint II", "Palayankottai joint I", "Palladam", "Pallavaram", "Pallikonda", "Pallipalayam",
    "Pallipattu", "Palliyadi", "Palugal", "Pammal", "Panagudi", "Panapakkam_Closed", "Panpozhi",
    "Panrutti", "Panthalkudi", "Papanasam", "Pappanadu", "Pappireddypatti", "Paramakudi", "Paramathi",
    "Parangipettai", "Pattukottai Joint I", "Pattukottai Joint II", "Pavoorchathram", "Peelamedu", "Pennadam",
    "Pennagaram", "Peraiyur", "Peralam", "Perambakkam", "Perambalur Joint 1", "Peranamallur", "Peravoorani",
    "Periamet", "Periyakanchipuram", "Periyakulam Joint I", "Periyakulam Joint II", "Periyanayakkan Palayam",
    "Pernampattu", "Perumagalur_Closed", "Perunazhi", "Perundurai", "Perungalur", "Perungulam",
    "Pethanayakanpalayam", "Pettai", "Pochampalli", "Podumbu", "Pollachi", "Polur", "Ponnamaravathi",
    "Ponneri", "Poompuhar_Closed", "Poonamallee", "Puduchathiram_Namakkal", "Puduchattiram_Chidambaram",
    "Pudukkottai", "Pudukkottai Joint I", "Pudupettai", "Pudur", "Puliyangudi", "Pullampadi",
    "Punchaipuliyampatti", "Purasaivakkam", "Radhapuram", "Rajackamangalam", "Rajapalayam", "Rajasinga mangalam",
    "Ramakrishna Rajupettai", "Ramanathapuram Joint I", "Ramanathapuram Joint II", "Rameshvaram",
    "Ranipet Joint I", "Rasipuram", "Rayakottai", "Redhills", "Rishivanthiyam", "Royapuram", "Salavakkam",
    "Salem East Joint I", "Salem West Joint I", "Salem West Joint III", "Samanatham", "Sanarpatti",
    "Sangagiri", "Sankaranainarkoil", "Sankarapuram", "Sathankulam", "Sathur", "Sathyamangalam",
    "Sathyamangalam_Dindivanam", "Sayalkudi", "Seerkazhi", "Selaiyur", "Sembiam", "Sendhurai_Ariyalur",
    "Sendhurai_Dindigul", "Senkottai", "Senthamangalam", "Sethiyathope", "Sethur", "Sholingar",
    "Singampunari", "Singanallur", "Sirupakkam", "Sivagangai Joint I", "Sivagangai Joint II",
    "Sivagiri_Erode", "Sivagiri_Tenkasi", "Sivakasi", "Soolagiri", "Sowcarpet", "Sriperumpudur",
    "Srirangam", "Srivaikundam", "Srivilliputhur","Subbramaniyapuram", "Sulur", "Sunguvarchattram", "Suramangalam", "Surampatti", "Surandai", "Swamimalai", "Tambaram Joint 1", "Tenkasi Joint I", "Tenkasi Joint II", "Thaanipadi", "Thackalai", "Thakkattur", "Thalaignayiru_Closed", "Thalaivasal", "Thalavadi", "Thallakualam", "Thamal", "Thamaraipatti", "Thammampatti", "Thandarampattu", "Thanjavur Joint I", "Tha.Pazhur", "Tharagampatti", "Tharamangalam", "Tharangampadi", "Thathaiyangarpettai", "Thellar", "Theni", "Thenkanikottai", "Thevaram", "Thillai Nagar", "Thingalur", "Thiruchengode", "Thiruchitrambalam_Closed", "Thiruchuli", "Thirukattupalli", "Thirukazhukundram", "Thirukovilur", "Thirukurungudi", "Thirukuvalai", "Thirumangalam", "Thirumarugal_Closed", "Thirumayam", "Thirumuttam", "Thirunavalur", "Thiruparankunram", "Thirupathur_closed", "Thirupathur Joint 1", "Thirupathur Joint 2", "Thirupoondi", "Thiruporur", "Thiruppanandhal", "Thiruppathur_Karaikudi", "Thirupuvanam", "Thiruthangal", "Thiruthuraipoondi", "Thiruttani", "Thiruvadanai", "Thiruvaiyaru", "Thiruvalankadu", "Thiruvannamalai Joint I", "Thiruvannamalai Joint II", "Thiruvarumpur", "Thiruvarur Joint 1", "Thiruvattar", "Thiruvenkadam_Closed", "Thiruvennainallur", "Thiruvidaimarudhur", "Thiruvonam", "Thiruvottiyur", "Thisaiyanvilai", "Thittakudi", "Thiyagaraya nagar", "Thiyaga thurgam", "Thondamuthur", "Thondi", "Thookanaicken Palayam", "Thottipalayam", "Thovalai", "Thozhuudhur", "Thuraiyur", "Thuvarankurichi", "Timiri_Closed", "Tiruchendur", "Tirunelveli Joint I", "Tirunelveli Joint II", "Tiruppur Joint I", "Tiruppur Joint II", "Tiruvallur Joint 1", "Tiruvallur Joint 2", "Trichi Joint III", "Trichy Joint 1", "Triplicane", "Tuticorin Joint I", "Tuticorin Joint II", "Udankudi", "Udayarpalayam", "Udumalpettai", "Ullikottai", "Ulundurpettai", "Uppiliyapuram", "Urayur", "Usilampatti", "Uthagamandalam -Joint I", "Uthagamandalam -Joint II", "Uthamapalayam", "Uthiramerur", "Uthukuli", "Uthumalai", "Vadakkananthal", "Vadakkuveeravanallur", "Vadalur", "Vada madurai", "Vadaponparappi", "Vadaseri", "Vadavalli", "Vadipatti", "Vaduvur_Closed", "Valankaiman", "Valathi", "Valavanur", "Valighandapuram", "Vallam_Dindivanam", "Vallam_Thanjavur", "Valliyur", "Vandavasi", "Vaniyampadi", "Vanur", "Vasudevanallur", "Vathalagundu", "Vathirairuppu", "Vazhapadi", "Veda senthur", "Vedharanyam", "Veerachozhan", "Veerasigamani", "Velacheri", "Velagoundampatti", "Velayuthampalayam", "Velipattinam", "Vellakovil", "Velliyanai", "Vellore Joint I", "Velur", "Vembakkam", "Veppannapalli", "Veppanthattai", "Veppur_Perambalur", "Veppur_Viruddchalam", "Verapandi", "Verkilambi", "Vettavalam", "Vickramasingapuram", "Vikkravandi", "Vikramangalam", "VILANGUDI", "Vilathikulam", "Villivakkam", "Villupuram Joint I", "Villupuram Joint II", "Viralimalai", "Virudhachalam Joint I", "Virudhachalam Joint II - Closed", "Virudhunagar Joint I", "Virudhunagar Joint II", "Virugambakkam", "Walaja", "Walajabad", "Yercaud"
];
     // Generate years 1901 → current year
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = 1901; y <= currentYear; y++) years.push(y.toString());

    // Load saved SRO/Year or default
    let savedSRO = localStorage.getItem('savedSRO') || sroList[0];
    let savedYear = localStorage.getItem('savedYear') || years[0];

    // Create floating UI
    const uiContainer = document.createElement('div');
    Object.assign(uiContainer.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        fontSize: '14px'
    });

    // SRO dropdown
    const sroSelect = document.createElement('select');
    sroList.forEach(sro => {
        const opt = document.createElement('option');
        opt.value = sro;
        opt.textContent = sro;
        if (sro === savedSRO) opt.selected = true;
        sroSelect.appendChild(opt);
    });
    sroSelect.addEventListener('change', () => {
        savedSRO = sroSelect.value;
        localStorage.setItem('savedSRO', savedSRO);
    });

    // Year dropdown
    const yearSelect = document.createElement('select');
    years.forEach(year => {
        const opt = document.createElement('option');
        opt.value = year;
        opt.textContent = year;
        if (year === savedYear) opt.selected = true;
        yearSelect.appendChild(opt);
    });
    yearSelect.addEventListener('change', () => {
        savedYear = yearSelect.value;
        localStorage.setItem('savedYear', savedYear);
    });

    uiContainer.appendChild(sroSelect);
    uiContainer.appendChild(document.createElement('br'));
    uiContainer.appendChild(yearSelect);
    document.body.appendChild(uiContainer);

    /* ========================
       MAIN AUTOMATION LOGIC
    ========================= */
    function waitForElement(selectorFn, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const el = selectorFn();
                if (el) return resolve(el);
                else if (Date.now() - startTime > timeout) return reject('Timeout waiting for element');
                else setTimeout(check, 200);
            };
            check();
        });
    }

    let startDoc = sessionStorage.getItem('startDoc');
    let endDoc = sessionStorage.getItem('endDoc');
    let currentDoc = sessionStorage.getItem('currentDoc');

    if (!startDoc || !endDoc) {
        startDoc = parseInt(prompt("Enter start document number:", "1"));
        endDoc = parseInt(prompt("Enter end document number:", "100"));
        if (isNaN(startDoc) || isNaN(endDoc) || startDoc > endDoc) {
            alert("Invalid input. Please reload and enter valid start/end numbers.");
            return;
        }
        sessionStorage.setItem('startDoc', startDoc);
        sessionStorage.setItem('endDoc', endDoc);
        currentDoc = startDoc;
        sessionStorage.setItem('currentDoc', currentDoc);
    } else {
        startDoc = parseInt(startDoc);
        endDoc = parseInt(endDoc);
        currentDoc = parseInt(currentDoc);
    }

    async function startProcess() {
        if (currentDoc > endDoc) {
            alert("✅ Finished all documents!");
            sessionStorage.removeItem('startDoc');
            sessionStorage.removeItem('endDoc');
            sessionStorage.removeItem('currentDoc');
            return;
        }
        // Watchdog: reload if page stuck loading (retry same doc)
setTimeout(() => {
    const docWiseRadio = document.querySelector('#DOC_WISE');
    const sroDropdown = document.querySelector('#cmb_SroName');
    if (!docWiseRadio || !sroDropdown) {
        console.warn(`⏳ Page seems stuck for doc ${currentDoc} — reloading to retry...`);
        sessionStorage.setItem('currentDoc', currentDoc); // ensure same doc number is kept
        location.reload();
    }
}, 10000); // 10 seconds timeout

        console.log(`\n📄 Starting automation for Document No: ${currentDoc}`);

        try {
            // Click "Search/View EC"
            const ecLink = Array.from(document.querySelectorAll('li')).find(el =>
                el.textContent.includes('Search/View EC')
            );
            if (ecLink) {
                ecLink.click();
                await new Promise(r => setTimeout(r, 700));
            }

            // Select Documentwise
            const docWiseRadio = document.querySelector('#DOC_WISE');
            if (docWiseRadio) {
                docWiseRadio.click();
                await new Promise(r => setTimeout(r, 400));
            }

            // Select SRO (from saved)
            const sroDropdown = document.querySelector('#cmb_SroName');
            if (sroDropdown) {
                const match = Array.from(sroDropdown.options).find(opt => opt.text.trim() === savedSRO);
                if (match) {
                    sroDropdown.value = match.value;
                    sroDropdown.dispatchEvent(new Event('change'));
                    await new Promise(r => setTimeout(r, 400));
                }
            }

            // Document number
            const docInput = document.querySelector('#txt_DocumentNo');
            if (docInput) {
                docInput.value = currentDoc;
                docInput.dispatchEvent(new Event('input'));
                docInput.dispatchEvent(new Event('change'));
                docInput.dispatchEvent(new Event('blur'));
            }

            // Year (from saved)
            const yearDropdown = document.querySelector('#cmb_Year');
            if (yearDropdown) {
                yearDropdown.value = savedYear;
                yearDropdown.dispatchEvent(new Event('change'));
            }

            // Document type
            const docTypeDropdown = document.querySelector('#cmb_doc_type');
            if (docTypeDropdown) {
                for (const option of docTypeDropdown.options) {
                    if (option.text.trim().toLowerCase().includes("regular document")) {
                        docTypeDropdown.value = option.value;
                        docTypeDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
            }

            // Captcha
            const captchaInput = await waitForElement(() => document.querySelector('#txt_Captcha'), 8000);
            captchaInput.focus();
            captchaInput.value = '';
            captchaInput.addEventListener('input', function () {
                this.value = this.value.toUpperCase();
            });

            await new Promise((resolve) => {
                captchaInput.addEventListener('keypress', function onKeyPress(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const searchBtn = document.querySelector('#btn_SearchDoc');
                        if (searchBtn) searchBtn.click();
                        captchaInput.removeEventListener('keypress', onKeyPress);
                        resolve();
                    }
                });
            });

            console.log("🔒 Waiting for search result...");

            const result = await new Promise((resolve) => {
                const observer = new MutationObserver((mutations, obs) => {
                    const genLink = Array.from(document.querySelectorAll('b')).find(el =>
                        el.textContent.includes('Click here to generate Encumbrance Certificate')
                    );
                    if (genLink) {
                        genLink.click();
                        obs.disconnect();
                        resolve('found');
                    }

                    const noRecordText = Array.from(document.querySelectorAll('span, div')).some(el =>
                        el.textContent.includes('No records found') ||
                        el.textContent.includes('No document found')
                    );
                    if (noRecordText) {
                        obs.disconnect();
                        resolve('skip');
                    }

                    const invalidCaptchaElem = Array.from(document.querySelectorAll('div.dialog-inner')).find(el =>
                        el.textContent.includes('Please Enter Valid Captcha')
                    );
                    if (invalidCaptchaElem) {
                        const okBtn = document.querySelector('div.dialog-buttons button');
                        if (okBtn) okBtn.click();
                        obs.disconnect();
                        resolve('retry');
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
                setTimeout(() => { observer.disconnect(); resolve('timeout'); }, 4000);
            });

            if (result === 'retry') {
                setTimeout(() => location.reload(), 2000);
                return;
            } else if (result === 'skip' || result === 'timeout') {
                currentDoc++;
                sessionStorage.setItem('currentDoc', currentDoc);
                setTimeout(() => location.reload(), 2000);
                return;
            }

            // Download link
            await new Promise((resolve) => {
                const obs2 = new MutationObserver((mutations, observer) => {
                    const downloadLink = Array.from(document.querySelectorAll('span')).find(el =>
                        el.textContent.trim() === 'Click here'
                    );
                    if (downloadLink) {
                        downloadLink.click();
                        observer.disconnect();
                        resolve();
                    }
                });
                obs2.observe(document.body, { childList: true, subtree: true });
                setTimeout(() => { obs2.disconnect(); resolve(); }, 10000);
            });

            currentDoc++;
            sessionStorage.setItem('currentDoc', currentDoc);
            setTimeout(() => location.reload(), 2000);

        } catch (error) {
            console.error(`❌ Error on doc ${currentDoc}:`, error);
            currentDoc++;
            sessionStorage.setItem('currentDoc', currentDoc);
            setTimeout(() => location.reload(), 2000);
        }
    }

    if (startDoc && endDoc && currentDoc) {
        startProcess();
    }
})();
