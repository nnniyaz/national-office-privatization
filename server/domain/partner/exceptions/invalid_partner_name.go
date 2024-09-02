package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidPartnerName = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PARTNER_NAME)
