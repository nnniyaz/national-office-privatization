package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidSecondaryContact = core.NewI18NError(core.EINVALID, core.TXT_INVALID_SECONDARY_CONTACT)
