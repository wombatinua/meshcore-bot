import Constants from "./meshcore.js/src/constants.js";
import WebBleConnection from "./meshcore.js/src/connection/web_ble_connection.js";

const connectButton = document.getElementById('connect');
const statusContainer = document.getElementById('status');

statusContainer.hidden = true;

// update status helper
function updateStatus(message) {

	const timestamp = new Date().toLocaleTimeString([], {

		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

	const entry = document.createElement('div');
	entry.textContent = `[${timestamp}] ${message}`;

	statusContainer.append(entry);
	statusContainer.scrollTop = statusContainer.scrollHeight;
}

// handle connect button click
connectButton.addEventListener('click', async () => {
	
	const connection = await WebBleConnection.open();
	let selfInfo;

	// wait on connection
	connection.on("connected", async () => {

		selfInfo = await connection.getSelfInfo().catch(() => null);
		const statusText = `Connected to ${selfInfo.name}`;
		
		connectButton.disabled = true;
		connectButton.textContent = statusText;
		statusContainer.hidden = false;
		updateStatus(statusText);

		// update clock on meshcore device
		await connection.syncDeviceTime();

		// send flood advert when connected
		// await connection.sendFloodAdvert();
	});

	// listen for new messages
	connection.on(Constants.PushCodes.MsgWaiting, async () => {

		try {
			const waitingMessages = await connection.getWaitingMessages();

			for (const message of waitingMessages) {
				
				// message received from contact
				if (message.contactMessage) {
					await onContactMessageReceived(message.contactMessage);
				// message received from channel
				} else if (message.channelMessage) {
					await onChannelMessageReceived(message.channelMessage);
				}
			}

		} catch (e) {
			console.log(e);
		}
	});

	// handle contact message
	async function onContactMessageReceived(message) {

		// find first contact matching pub key prefix
		const contact = await connection.findContactByPublicKeyPrefix(message.pubKeyPrefix);

		if (!contact) {

			updateStatus("Received message from unknown contact");
			return;
		}

		const contactMessage = `${contact.advName} → ${selfInfo.name}: ${message.text}`;
		updateStatus(contactMessage);

		// echo message back to contact
		const echoMessage = `${selfInfo.name} → ${contact.advName}: ${message.text}`;
		await connection.sendTextMessage(contact.publicKey, message.text, Constants.TxtTypes.Plain);
		updateStatus(echoMessage);
	}

	// handle channel message
	async function onChannelMessageReceived(message) {

		// get channel name
		const channelIdx = message.channelIdx;
		const channelInfo = await connection.getChannel(channelIdx);
		const channelName = channelInfo.name;
		
		const channelMessage = `${channelName} ← ${message.text}`;
		updateStatus(channelMessage);
	}
});