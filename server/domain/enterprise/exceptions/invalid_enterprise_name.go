package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrInvalidEnterpriseName = core.NewI18NError(core.EINVALID, core.TXT_INVALID_ENTERPRISE_NAME)
