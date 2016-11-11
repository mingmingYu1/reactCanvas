import message from 'bfd/message'

function msgdanger(msg, duration = 2) {
	message.danger(msg)
	setTimeout(() => {
		message.close()
	}, duration * 1000)
}

export default msgdanger