---
title: CachyOS
date: 2025-08-21
---

Jag har kört CachyOS i tre veckor snart. Det började med problem, och det är inte helt problemfritt fortfarande. Jag tampas nästan dagligen med Battle.net och det finns inget riktigt bra sätt att köra GeForce Now på än så länge. Jag fick också installera Windows för att kunna spela Battlefield 6 betan med en kompis.

Jag gjorde två val i början, som visade sig spara mig en hel del trubbel. Limine som bootloader och btrfs som filsystem. Båda de valen var halvt på känsla, men CachyOS wikin rekommenderade Limine så det fick bli den. Jag är inte en helt ovan Linux-användare, men jag har mest jobbat med headless servrar i min garderob eller en PC på jobbet som en testdator. Jag tänkte inte heller att jag skulle behöva snapshots, men samtidigt så kunde jag inte hitta något riktigt negativt med btrfs.

Redan vid första försöket att installera CachyOS så misslyckades jag. Installationen blev avbruten. Till sist letade jag mig in på deras Discord och såg att en eller två andra också hade samma problem och rekommendationen var att "prova lite senare".

Visst, ok, det är väl kanske bara i Linuxvärlden som det är ett acceptabelt svar. Vänta till nästa dag, och då hade jag inga problem. Något med package installern som inte kunde ladda ner vissa paket. Oh well.

Fredag kväll nu, jag har installerat CachyOS och sitter och försöker mounta mina diska och min garderobsserver. Lär mig en del om fstab. Kör en systemuppdatering.

Starta om datorn. Den startar inte. Bara en svart skärm. Great. Går och lägger mig, och funderar seriöst på att gå tillbaka till Windows. Jag vet att Arch kräver en del handpåläggning men har inte lust med att datorn ska brickas varje gång jag startar om den.

Lördag. Sätter mig vid datorn som vanligt. Kommer på att den inte funkar, och det känns lite olustigt att min vanliga rutin med att sätta mig vid datorn är bruten. En liten tanke om beroende blåser runt i huvudet.

Jag ser dock att jag har snapshots att välja mellan när jag bootar. Väljer en snapshot innan jag installerade och meckade med en del program. Bootar direkt. Jag listar ut vilken är den senaste snapshoten som funkar och kör på den. Så tack Limine och btrfs för att ni räddade mig där. Zero config för min del. Det bara funkade.

En vecka senare får jag anledning att tacka mitt val av Limine igen då jag måste dual boota och fixa secure boot för att få igång BF6. Med Limine var det väldigt enkelt att få igång, och tack till CachyOS wiki igen för guidning. Det gäller dock att läsa hela texten innan man gör något. Wiki-författare är kanske inte de mest pedagogiska människorna på jorden. Hade man följt guiden steg för steg hade man missat raden nästan längst ner som säger "har du Limine så kan du skippa nästan alla de här stegen". Ja, tack för det och tur att jag läste så långt.

Det tog ungefär en vecka, sedan kom jag på mig själv att jag satte mig vid datorn och började använda den utan att ens tänka på att det var Linux.

Så fort man ska spela WoW blir man dock påmind. Har fått använda tre olika appar för att kunna starta Battle.net. Först Lutris, som slutade funka, sedan Bottles som också slutade funka efter ett tag. Då hittade jag Faugust som jag kör just nu och har än så länge inte svikit mig. WoW körs väldigt bra under CachyOS också, så det är najs. Addons via WoWUP som har en supersnabb klient.

Men det är väl det som är taggen i hälen, det där som gör att det inte känns helt hundra. Kommer man hem från jobb och gamea lite så vill man inte börja felsöka eller labba. Man vill direkt till spelet.

Har inget emot att lära mig nya grejer eller sitta och labba fram och tillbaka men ibland vill man bara att det ska funka. Så det blir en dual boot med Windows än så länge. Men annars känns det fantastiskt. Linux på desktop har verkligen kommit långt.

I'm using CachyOS, btw.

[![CachyOS Desktop](/assets/media/pics/cachyos-prntscrn.png)](/assets/media/pics/cachyos-prntscrn.png)
