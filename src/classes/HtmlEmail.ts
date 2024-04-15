import { MailAlertOptions } from '../interfaces/MailAlertOptions'
import { MailHeaderOptions } from '../interfaces/MailHeaderOptions'

export class HtmlEmail {
  blocks: string[]
  preview: string
  width: number

  constructor (preview: string, width: number = 600) {
    this.width = width
    this.blocks = []
    this.preview = preview
  }

  static create (preview: string, width: number = 600) {
    return new HtmlEmail(preview, width)
  }

  header (options: Partial<MailHeaderOptions>) {
    const conf: MailHeaderOptions = {
      logo: null,
      logoWidth: 50,
      logoAlt: '',
      title: '',
      ...options
    }

    this.blocks.push(`<!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${
             this.width
           }px;" width="${this.width}"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
    <div style="margin: 0px auto; max-width: ${this.width}px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 0px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 class="" style="vertical-align:top;width:${this.width}px;"
              >
            <![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top"
                    width="100%"
                  >
                    <tbody>
                      <tr style="${conf.logo === null ? 'display: none;' : ''}">
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td style="width: ${conf.logoWidth}px">
                                  <img
                                    alt="${conf.logoAlt}"
                                    height="auto"
                                    src="${conf.logo ?? ''}"
                                    style="
                                      border: 0;
                                      display: block;
                                      outline: none;
                                      text-decoration: none;
                                      height: auto;
                                      width: 100%;
                                      font-size: 14px;
                                    "
                                    width="${conf.logoWidth}"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: Helvetica, Arial, sans-serif;
                              font-size: 18px;
                              font-weight: 400;
                              line-height: 24px;
                              text-align: left;
                              color: #434245;
                            "
                          >
                            <h1
                              style="
                                margin: 0;
                                font-size: 24px;
                                line-height: normal;
                                font-weight: bold;
                              "
                            >
                              ${conf.title}
                            </h1>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
              </td>
            
          </tr>
        
                    </table>
                  <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        <![endif]-->`)

    return this
  }

  text (text: string) {
    this.blocks.push(`<!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${this.width}px;" width="${this.width}"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  <div style="margin: 0px auto; max-width: ${this.width}px">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
            "
          >
            <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:${this.width}px;"
          >
        <![endif]-->
            <div
              class="mj-column-per-100 mj-outlook-group-fix"
              style="
                font-size: 0px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: top;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: top"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: 400;
                          line-height: 24px;
                          text-align: left;
                          color: #434245;
                        "
                      >
                        <p style="margin: 0">${text}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->`)

    return this
  }

  button (text: string, url: string) {
    this.blocks.push(`<!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${this.width}px;" width="${this.width}"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  <div style="margin: 0px auto; max-width: ${this.width}px">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
            "
          >
            <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:${this.width}px;"
          >
        <![endif]-->
            <div
              class="mj-column-per-100 mj-outlook-group-fix"
              style="
                font-size: 0px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: top;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: top"
                width="100%"
              >
                <tbody>
                    <tr>
                        <td align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                            <tbody><tr>
                            <td align="center" bgcolor="#2e58ff" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#2e58ff;" valign="middle">
                                <a href="${url}" style="display: inline-block; background: #2e58ff; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 30px; margin: 0; text-decoration: none; text-transform: uppercase; padding: 10px 
        25px; mso-padding-alt: 0px; border-radius: 30px;" target="_blank"> ${text} </a>
                            </td>
                            </tr>
                        </tbody></table>
                        </td>
                    </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->`)

    return this
  }

  alert (options: Partial<MailAlertOptions>) {
    const conf: MailAlertOptions = {
      title: null,
      description: null,
      windowTitle: 'ALERT',
      buttonText: 'More details',
      url: null,
      ...options
    }

    this.blocks.push(` <!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${
         this.width
       }px;" width="${this.width}"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  <div
    style="
      background: #ffcdb0;
      background-color: #ffcdb0;
      margin: 0px auto;
      border-radius: 4px;
      max-width: ${this.width}px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        background: #ffcdb0;
        background-color: #ffcdb0;
        width: 100%;
        border-radius: 4px;
      "
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
            "
          >
            <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:${this.width}px;"
          >
        <![endif]-->
            <div
              class="mj-column-per-100 mj-outlook-group-fix"
              style="
                font-size: 0px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: top;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: top"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: bold;
                          line-height: 24px;
                          text-align: left;
                          color: #7a0b1f;
                        "
                      >
                        <p
                          class="date"
                          style="
                            margin: 0;
                            margin-bottom: 5px;
                            font-size: 16px;
                          "
                        >
                          ${conf.windowTitle}
                        </p>
                        <h2
                          style="
                            ${conf.title === null ? 'display: none;' : ''}
                            margin: 0;
                            font-size: 24px;
                            font-weight: bold;
                            line-height: 24px;
                          "
                        >
                         ${conf.title ?? ''}
                        </h2>
                      </div>
                    </td>
                  </tr>
                  <tr style="${
                    conf.description === null ? 'display: none;' : ''
                  }">
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: 400;
                          line-height: 24px;
                          text-align: left;
                          color: #7a0b1f;
                        "
                      >
                        <p style="margin: 0">
                          ${conf.description ?? ''}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr style="${conf.url === null ? 'display: none;' : ''}">
                    <td
                      align="right"
                      vertical-align="middle"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="border-collapse: separate; line-height: 100%"
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              bgcolor="#7A0B1F"
                              role="presentation"
                              style="
                                border: none;
                                border-radius: 30px;
                                cursor: auto;
                                mso-padding-alt: 10px 25px;
                                background: #7a0b1f;
                              "
                              valign="middle"
                            >
                              <a
                                href="${conf.url}"
                                style="
                                  display: inline-block;
                                  background: #7a0b1f;
                                  color: #ffcdb0;
                                  font-family: Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  font-weight: bold;
                                  line-height: 30px;
                                  margin: 0;
                                  text-decoration: none;
                                  text-transform: uppercase;
                                  padding: 10px 25px;
                                  mso-padding-alt: 0px;
                                  border-radius: 30px;
                                "
                                target="_blank"
                              >
                                ${conf.buttonText}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->`)

    return this
  }

  warning (options: Partial<MailAlertOptions>) {
    const conf: MailAlertOptions = {
      title: null,
      description: null,
      windowTitle: 'WARNING',
      buttonText: 'More details',
      url: null,
      ...options
    }

    this.blocks.push(`<!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${
         this.width
       }px;" width="${this.width}"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  <div
    style="
      background: #fff0b5;
      background-color: #fff0b5;
      margin: 0px auto;
      border-radius: 4px;
      max-width: ${this.width}px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        background: #fff0b5;
        background-color: #fff0b5;
        width: 100%;
        border-radius: 4px;
      "
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
            "
          >
            <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:${this.width}px;"
          >
        <![endif]-->
            <div
              class="mj-column-per-100 mj-outlook-group-fix"
              style="
                font-size: 0px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: top;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: top"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: bold;
                          line-height: 24px;
                          text-align: left;
                          color: #7a5200;
                        "
                      >
                        <p
                          class="date"
                          style="
                            margin: 0;
                            margin-bottom: 5px;
                            font-size: 16px;
                          "
                        >
                          ${conf.windowTitle}
                        </p>
                        <h2
                          style="
                            ${conf.title === null ? 'display:none;' : ''}
                            margin: 0;
                            font-size: 24px;
                            font-weight: bold;
                            line-height: 24px;
                          "
                        >
                          ${conf.title ?? ''}
                        </h2>
                      </div>
                    </td>
                  </tr>
                  <tr style="${
                    conf.description === null ? 'display: none;' : ''
                  }">
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: 400;
                          line-height: 24px;
                          text-align: left;
                          color: #7a5200;
                        "
                      >
                        <p style="margin: 0">
                            ${conf.description ?? ''}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr style="${conf.url === null ? 'display: none;' : ''}">
                    <td
                      align="right"
                      vertical-align="middle"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="border-collapse: separate; line-height: 100%"
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              bgcolor="#7A400C"
                              role="presentation"
                              style="
                                border: none;
                                border-radius: 30px;
                                cursor: auto;
                                mso-padding-alt: 10px 25px;
                                background: #7a400c;
                              "
                              valign="middle"
                            >
                              <a
                                href="${conf.url ?? ''}"
                                style="
                                  display: inline-block;
                                  background: #7a400c;
                                  color: #fff0b5;
                                  font-family: Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  font-weight: bold;
                                  line-height: 30px;
                                  margin: 0;
                                  text-decoration: none;
                                  text-transform: uppercase;
                                  padding: 10px 25px;
                                  mso-padding-alt: 0px;
                                  border-radius: 30px;
                                "
                                target="_blank"
                              >
                                ${conf.buttonText}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->`)

    return this
  }

  success (options: Partial<MailAlertOptions>) {
    const conf: MailAlertOptions = {
      title: null,
      description: null,
      windowTitle: 'SUCCESS',
      buttonText: 'More details',
      url: null,
      ...options
    }

    this.blocks.push(`<!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${
         this.width
       }px;" width="${this.width}"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  <div
    style="
      background: #d3fbd8;
      background-color: #d3fbd8;
      margin: 0px auto;
      border-radius: 4px;
      max-width: ${this.width}px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        background: #d3fbd8;
        background-color: #d3fbd8;
        width: 100%;
        border-radius: 4px;
      "
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
            "
          >
            <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:${this.width}px;"
          >
        <![endif]-->
            <div
              class="mj-column-per-100 mj-outlook-group-fix"
              style="
                font-size: 0px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: top;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: top"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: bold;
                          line-height: 24px;
                          text-align: left;
                          color: #307007;
                        "
                      >
                        <p
                          class="date"
                          style="
                            margin: 0;
                            margin-bottom: 5px;
                            font-size: 16px;
                          "
                        >
                          ${conf.windowTitle}
                        </p>
                        <h2
                          style="
                            ${conf.title === null ? 'display:none;' : ''}
                            margin: 0;
                            font-size: 24px;
                            font-weight: bold;
                            line-height: 24px;
                          "
                        >
                          ${conf.title ?? ''}
                        </h2>
                      </div>
                    </td>
                  </tr>
                  <tr style="${
                    conf.description === null ? 'display:none;' : ''
                  }">
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: 400;
                          line-height: 24px;
                          text-align: left;
                          color: #307007;
                        "
                      >
                        <p style="margin: 0">
                          ${conf.description ?? ''}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr style="${conf.url === null ? 'display:none;' : ''}">
                    <td
                      align="right"
                      vertical-align="middle"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="border-collapse: separate; line-height: 100%"
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              bgcolor="#307007"
                              role="presentation"
                              style="
                                border: none;
                                border-radius: 30px;
                                cursor: auto;
                                mso-padding-alt: 10px 25px;
                                background: #307007;
                              "
                              valign="middle"
                            >
                              <a
                                href="${conf.url ?? ''}"
                                style="
                                  display: inline-block;
                                  background: #307007;
                                  color: #d3fbd8;
                                  font-family: Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  font-weight: bold;
                                  line-height: 30px;
                                  margin: 0;
                                  text-decoration: none;
                                  text-transform: uppercase;
                                  padding: 10px 25px;
                                  mso-padding-alt: 0px;
                                  border-radius: 30px;
                                "
                                target="_blank"
                              >
                                ${conf.buttonText}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->`)

    return this
  }

  info (options: Partial<MailAlertOptions>) {
    const conf: MailAlertOptions = {
      title: null,
      description: null,
      windowTitle: 'INFO',
      buttonText: 'More details',
      url: null,
      ...options
    }

    this.blocks.push(`<!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${
         this.width
       }px;" width="${this.width}"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  <div
    style="
      background: #bffcfd;
      background-color: #bffcfd;
      margin: 0px auto;
      border-radius: 4px;
      max-width: ${this.width}px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        background: #bffcfd;
        background-color: #bffcfd;
        width: 100%;
        border-radius: 4px;
      "
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
            "
          >
            <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:${this.width}px;"
          >
        <![endif]-->
            <div
              class="mj-column-per-100 mj-outlook-group-fix"
              style="
                font-size: 0px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: top;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: top"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: bold;
                          line-height: 24px;
                          text-align: left;
                          color: #053878;
                        "
                      >
                        <p
                          class="date"
                          style="
                            margin: 0;
                            margin-bottom: 5px;
                            font-size: 16px;
                          "
                        >
                          ${conf.windowTitle}
                        </p>
                        <h2
                          style="
                          ${conf.title === null ? 'display:none;' : ''}
                            margin: 0;
                            font-size: 24px;
                            font-weight: bold;
                            line-height: 24px;
                          "
                        >
                          ${conf.title ?? ''}
                        </h2>
                      </div>
                    </td>
                  </tr>
                  <tr style="${
                    conf.description === null ? 'display:none;' : ''
                  }">
                    <td
                      align="left"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-size: 18px;
                          font-weight: 400;
                          line-height: 24px;
                          text-align: left;
                          color: #053878;
                        "
                      >
                        <p style="margin: 0">
                          ${conf.description ?? ''}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr style="${conf.url === null ? 'display:none;' : ''}">
                    <td
                      align="right"
                      vertical-align="middle"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="border-collapse: separate; line-height: 100%"
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              bgcolor="#053878"
                              role="presentation"
                              style="
                                border: none;
                                border-radius: 30px;
                                cursor: auto;
                                mso-padding-alt: 10px 25px;
                                background: #053878;
                              "
                              valign="middle"
                            >
                              <a
                                href="${conf.url ?? ''}"
                                style="
                                  display: inline-block;
                                  background: #053878;
                                  color: #bffcfd;
                                  font-family: Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  font-weight: bold;
                                  line-height: 30px;
                                  margin: 0;
                                  text-decoration: none;
                                  text-transform: uppercase;
                                  padding: 10px 25px;
                                  mso-padding-alt: 0px;
                                  border-radius: 30px;
                                "
                                target="_blank"
                              >
                                ${conf.buttonText}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->`)

    return this
  }

  spacer (height: number = 20) {
    this.blocks.push(`<!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${this.width}px;" width="${this.width}"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  <div style="margin: 0px auto; max-width: ${this.width}px">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 0;
              text-align: center;
            "
          >
            <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:${this.width}px;"
          >
        <![endif]-->
            <div
              class="mj-column-per-100 mj-outlook-group-fix"
              style="
                font-size: 0px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: top;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: top"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style="font-size: 0px; word-break: break-word">
                      <!--[if mso | IE]>
  
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="${height}" style="vertical-align:top;height:${height}px;">
    
  <![endif]-->
                      <div style="height: ${height}px"> </div>
                      <!--[if mso | IE]>
  
      </td></tr></table>
    
  <![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->`)

    return this
  }

  end () {
    return `<!DOCTYPE html>
    <html
      lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <title>${this.preview}</title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          #outlook a {
            padding: 0;
          }
    
          body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
    
          table,
          td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
    
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
    
          p {
            display: block;
            margin: 13px 0;
          }
        </style>
        <!--[if mso]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG />
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        <![endif]-->
        <!--[if lte mso 11]>
          <style type="text/css">
            .mj-outlook-group-fix {
              width: 100% !important;
            }
          </style>
        <![endif]-->
        <style type="text/css">
          @media only screen and (min-width: 480px) {
            .mj-column-per-100 {
              width: 100% !important;
              max-width: 100%;
            }
          }
        </style>
        <style type="text/css">
          @media only screen and (max-width: 480px) {
            table.mj-full-width-mobile {
              width: 100% !important;
            }
    
            td.mj-full-width-mobile {
              width: auto !important;
            }
          }
        </style>
        <style type="text/css">
          a,
          span,
          td,
          th {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
          }
        </style>
      </head>
    
      <body style="background-color: #ffffff">
        <div
          style="
            display: none;
            font-size: 1px;
            color: #ffffff;
            line-height: 1px;
            max-height: 0px;
            max-width: 0px;
            opacity: 0;
            overflow: hidden;
          "
        >
          ${this.preview}
        </div>
        <div style="background-color: #ffffff">${this.blocks.join('')}</div>
      </body>
    </html>
    `
  }
}
