package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrInvalidPrimaryContact = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRIMARY_CONTACT)
