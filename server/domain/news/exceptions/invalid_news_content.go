package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidNewsContent = core.NewI18NError(core.EINVALID, core.TXT_INVALID_NEWS_CONTENT)
