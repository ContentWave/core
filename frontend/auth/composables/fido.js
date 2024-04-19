const bufferToBase64 = buffer =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))
const base64ToBuffer = base64 =>
  Uint8Array.from(atob(base64), c => c.charCodeAt(0))

export function canSetupFido () {
  const credential = window.localStorage.getItem('fidoCredential') ?? null
  const deviceId = window.localStorage.getItem('fidoDeviceId') ?? null
  return navigator.credentials && credential === null && deviceId === null
}

export function isFidoSetup () {
  const credential = window.localStorage.getItem('fidoCredential') ?? null
  const deviceId = window.localStorage.getItem('fidoDeviceId') ?? null
  return navigator.credentials && credential !== null && deviceId !== null
}

export function uninstallFido () {
  window.localStorage.removeItem('fidoCredential')
  window.localStorage.removeItem('fidoDeviceId')
}

export async function registerFido (deviceName) {
  const route = useRoute()
  const api = useApi()
  try {
    const { cred: deviceId, registrationOptions: credentialCreationOptions } =
      await api.post(
        `/auth/challenges/${route.query.challenge_id}/fido2/init`,
        {
          deviceName
        }
      )

    credentialCreationOptions.challenge = new Uint8Array(
      credentialCreationOptions.challenge.data
    )
    credentialCreationOptions.user.id = new Uint8Array(
      credentialCreationOptions.user.id.data
    )

    const credential = await navigator.credentials.create({
      publicKey: credentialCreationOptions
    })

    const credentialId = bufferToBase64(credential.rawId)

    window.localStorage.setItem(
      'fidoCredential',
      JSON.stringify({ credentialId })
    )
    window.localStorage.setItem('fidoDeviceId', deviceId)

    await api.post(
      `/auth/challenges/${route.query.challenge_id}/fido2/${deviceId}/register`,
      {
        credential: {
          rawId: credentialId,
          response: {
            attestationObject: bufferToBase64(
              credential.response.attestationObject
            ),
            clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
            id: credential.id,
            type: credential.type
          }
        }
      }
    )

    return true
  } catch (e) {
    console.error('registration failed', e)
    return false
  }
}

export async function loginFido () {
  const route = useRoute()
  const api = useApi()
  try {
    const deviceId = window.localStorage.getItem('fidoDeviceId')
    const { credentialId } = JSON.parse(
      window.localStorage.getItem('fidoCredential')
    )

    const credentialRequestOptions = await api.get(
      `/fido2/${deviceId}/auth-options`
    )
    credentialRequestOptions.challenge = new Uint8Array(
      credentialRequestOptions.challenge.data
    )
    credentialRequestOptions.allowCredentials = [
      {
        id: base64ToBuffer(credentialId),
        type: 'public-key',
        transports: ['internal']
      }
    ]

    const credential = await navigator.credentials.get({
      publicKey: credentialRequestOptions
    })

    const response = await api.post(
      `/auth/challenges/${route.query.challenge_id}/fido2/${deviceId}/login`,
      {
        credential: {
          rawId: bufferToBase64(credential.rawId),
          response: {
            authenticatorData: bufferToBase64(
              credential.response.authenticatorData
            ),
            signature: bufferToBase64(credential.response.signature),
            userHandle: bufferToBase64(credential.response.userHandle),
            clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
            id: credential.id,
            type: credential.type
          }
        }
      }
    )
    return response
  } catch (e) {
    console.error('authentication failed', e)

    return false
  }
}
