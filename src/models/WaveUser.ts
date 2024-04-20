import mongoose, { Connection, Document, HydratedDocument } from 'mongoose'
import { IDbPostalAddress } from '../classes/Orm/Types/PostalAddress'
import { Plugins } from '../classes/Plugins'
import { Conflict, InternalServerError } from 'http-errors'
import { randomUUID } from 'crypto'
import { HtmlEmail } from '../classes/Tools/HtmlEmail'
import { IWaveModelAuthorizations } from './WaveModel'
import { Config } from '../classes/Config'
import { Db } from '../classes/Db'

interface IFido2Credential {
  id: string
  deviceName: string
  challenge: Buffer
  authChallenge: Buffer
  publicKey: string
  prevCounter: number
}

interface ITotp {
  secret: string
  pending: boolean
  isGoogle: boolean
}

export interface IWaveUser extends Document {
  firstname: string
  lastname: string
  email: string
  password: string
  phone: string
  avatar: string
  address: IDbPostalAddress
  metadata: { [key: string]: any }
  roles: string[]
  validated: boolean
  validationCode: string
  invited: boolean
  invitationCode: string
  totp: ITotp
  fido2: IFido2Credential[]
  sso: { [key: string]: string }
}

interface IWaveUserMethods {}

export interface WaveUserModel
  extends mongoose.Model<IWaveUser, {}, IWaveUserMethods> {
  invite(
    request: any,
    email: string,
    redirect: string,
    preset?: { [type: string]: any },
    overwrite?: boolean
  ): Promise<any>
  resolveAuthorizations(
    authorizations: IWaveModelAuthorizations | undefined,
    mode: 'read' | 'write',
    user?: HydratedDocument<IWaveUser, WaveUserModel> | null,
    existingDocument?: HydratedDocument<any, any> | null
  ): boolean
}

const schema = new mongoose.Schema<IWaveUser, WaveUserModel, IWaveUserMethods>(
  {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    address: {
      country: {
        $type: String,
        enum: [
          'AF',
          'AL',
          'DZ',
          'AS',
          'AD',
          'AO',
          'AI',
          'AQ',
          'AG',
          'AR',
          'AM',
          'AW',
          'AU',
          'AT',
          'AZ',
          'BS',
          'BH',
          'BD',
          'BB',
          'BY',
          'BE',
          'BZ',
          'BJ',
          'BM',
          'BT',
          'BO',
          'BQ',
          'BA',
          'BW',
          'BV',
          'BR',
          'IO',
          'BN',
          'BG',
          'BF',
          'BI',
          'CV',
          'KH',
          'CM',
          'CA',
          'KY',
          'CF',
          'TD',
          'CL',
          'CN',
          'CX',
          'CC',
          'CO',
          'KM',
          'CD',
          'CG',
          'CK',
          'CR',
          'HR',
          'CU',
          'CW',
          'CY',
          'CZ',
          'CI',
          'DK',
          'DJ',
          'DM',
          'DO',
          'EC',
          'EG',
          'SV',
          'GQ',
          'ER',
          'EE',
          'SZ',
          'ET',
          'FK',
          'FO',
          'FJ',
          'FI',
          'FR',
          'GF',
          'PF',
          'TF',
          'GA',
          'GM',
          'GE',
          'DE',
          'GH',
          'GI',
          'GR',
          'GL',
          'GD',
          'GP',
          'GU',
          'GT',
          'GG',
          'GN',
          'GW',
          'GY',
          'HT',
          'HM',
          'VA',
          'HN',
          'HK',
          'HU',
          'IS',
          'IN',
          'ID',
          'IR',
          'IQ',
          'IE',
          'IM',
          'IL',
          'IT',
          'JM',
          'JP',
          'JE',
          'JO',
          'KZ',
          'KE',
          'KI',
          'KP',
          'KR',
          'KW',
          'KG',
          'LA',
          'LV',
          'LB',
          'LS',
          'LR',
          'LY',
          'LI',
          'LT',
          'LU',
          'MO',
          'MG',
          'MW',
          'MY',
          'MV',
          'ML',
          'MT',
          'MH',
          'MQ',
          'MR',
          'MU',
          'YT',
          'MX',
          'FM',
          'MD',
          'MC',
          'MN',
          'ME',
          'MS',
          'MA',
          'MZ',
          'MM',
          'NA',
          'NR',
          'NP',
          'NL',
          'NC',
          'NZ',
          'NI',
          'NE',
          'NG',
          'NU',
          'NF',
          'MP',
          'NO',
          'OM',
          'PK',
          'PW',
          'PS',
          'PA',
          'PG',
          'PY',
          'PE',
          'PH',
          'PN',
          'PL',
          'PT',
          'PR',
          'QA',
          'MK',
          'RO',
          'RU',
          'RW',
          'RE',
          'BL',
          'SH',
          'KN',
          'LC',
          'MF',
          'PM',
          'VC',
          'WS',
          'SM',
          'ST',
          'SA',
          'SN',
          'RS',
          'SC',
          'SL',
          'SG',
          'SX',
          'SK',
          'SI',
          'SB',
          'SO',
          'ZA',
          'GS',
          'SS',
          'ES',
          'LK',
          'SD',
          'SR',
          'SJ',
          'SE',
          'CH',
          'SY',
          'TW',
          'TJ',
          'TZ',
          'TH',
          'TL',
          'TG',
          'TK',
          'TO',
          'TT',
          'TN',
          'TR',
          'TM',
          'TC',
          'TV',
          'UG',
          'UA',
          'AE',
          'GB',
          'UM',
          'US',
          'UY',
          'UZ',
          'VU',
          'VE',
          'VN',
          'VG',
          'VI',
          'WF',
          'EH',
          'YE',
          'ZM',
          'ZW',
          'AX',
          ''
        ],
        default: '',
        index: true
      },
      name_line: { $type: String, default: '' },
      organisation_name: { $type: String, default: '' },
      administrative_area: { $type: String, default: '' },
      locality: { $type: String, default: '', index: true },
      postal_code: { $type: String, default: '', index: true },
      thoroughfare: { $type: String, default: '', index: true },
      premise: { $type: String, default: '' },
      location: {
        type: {
          $type: String,
          enum: ['Point'],
          required: true,
          default: 'Point'
        },
        coordinates: {
          $type: [Number],
          required: true,
          default: [0, 0]
        }
      }
    },
    metadata: {},
    sso: {},
    roles: [String],
    validated: Boolean,
    validationCode: String,
    invited: Boolean,
    invitationCode: String,
    totp: {
      secret: String,
      pending: Boolean,
      isGoogle: Boolean
    },
    fido2: [
      {
        id: String,
        deviceName: String,
        challenge: Buffer,
        authChallenge: Buffer,
        publicKey: String,
        prevCounter: Number
      }
    ]
  },
  { typeKey: '$type' }
)

schema.static(
  'invite',
  async function invite (
    request: any,
    email: string,
    redirect: string,
    preset: { [key: string]: any } = {},
    overwrite: boolean = false
  ) {
    email = email.trim().toLowerCase()

    let user: any = await this.findOne({
      email
    })
    if (user && !overwrite) throw new Conflict()
    if (!user)
      user = await this.create({
        email,
        invited: true,
        invitationCode: randomUUID(),
        validated: false,
        ...preset
      })
    else {
      for (let key in preset) {
        user.set(key, preset[key])
      }
      await user.save()
    }

    const emailPlugin = Plugins.getInstance('email')

    if (!emailPlugin)
      throw new Error('Cannot send email, no email provider has been installed')

    const invitationUrl = `${
      process.env.BASE_URL ?? ''
    }/auth/accept-invitation?code=${
      user.invitationCode
    }&redirect=${encodeURIComponent(redirect ?? '')}`

    const html = HtmlEmail.create(
      request.$t(
        `You have been invited to {name} !`,
        {
          name: Config.get('title') ?? ''
        },
        null,
        'auth'
      )
    )
      .header({
        logo: Config.get('logo') ?? '',
        title: request.$t(
          'You have been invited to register to {name}',
          { name: Config.get('title') ?? '' },
          null,
          'auth'
        )
      })
      .text(
        request.$t(
          'Please click on the button below to accept your invitation and create your account, or copy-paste the following link in your browser address bar :<br />{url}',
          { url: invitationUrl },
          null,
          'auth'
        )
      )
      .button(request.$t('Accept invitation', {}, null, 'auth'), invitationUrl)
      .end()

    const sent = await emailPlugin.sendEmail(
      user,
      request.$t(
        `You have been invited to {name} !`,
        {
          name: Config.get('title') ?? ''
        },
        null,
        'auth'
      ),
      html
    )

    if (!sent) throw new InternalServerError()

    return user
  }
)

schema.static(
  'resolveAuthorizations',
  function resolveAuthorizations (
    authorizations: IWaveModelAuthorizations | undefined,
    mode: 'read' | 'write',
    user: HydratedDocument<IWaveUser, WaveUserModel> | null = null,
    existingDocument: HydratedDocument<any, any> | null = null
  ): boolean {
    if (authorizations === undefined) return true
    if (!authorizations.enabled) return true
    const userRoles = user?.roles ?? ['$anonymous']
    if (
      existingDocument &&
      user &&
      existingDocument._owner?._id?.toHexString() === user.id
    )
      userRoles.push('$owner')

    let invert = false
    for (let role in authorizations[mode].roles)
      if (userRoles.includes(role)) invert = true

    if (invert) return !authorizations[mode].allow
    return authorizations[mode].allow
  }
)

schema.pre('save', async function (next) {
  if (this.isModified('address')) {
    const geocodePlugin = Plugins.getInstance('geocode')
    if (geocodePlugin) {
      const location = await geocodePlugin.geocode({
        thoroughfare: this.address?.thoroughfare ?? '',
        postal_code: this.address?.postal_code ?? '',
        locality: this.address?.locality ?? '',
        country: this.address?.country ?? '',
        administrative_area: this.address?.administrative_area ?? ''
      })
      this.address.location = {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      }
    }
  }

  this.lastname = (this.lastname ?? '').toUpperCase()
  this.email = this.email.trim().toLowerCase()

  return next()
})

schema.index({ 'address.location': '2dsphere' })

export default function createWaveUser (conn: Connection) {
  conn.model<IWaveUser, WaveUserModel>('WaveUser', schema)
}

export const getWaveUserModel = function () {
  return Db.instance.model<IWaveUser, WaveUserModel>('WaveUser')
}
