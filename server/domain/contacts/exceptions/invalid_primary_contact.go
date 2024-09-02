package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidPrimaryContact = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRIMARY_CONTACT)
