CREATE TYPE workplace as ENUM('FIVEGUYS');
CREATE TYPE service as ENUM('SDWORX', 'FGP');
CREATE TYPE shift_type as ENUM('timecard', 'schedule');
CREATE TYPE shift_category as ENUM('work', 'holiday');

CREATE TYPE plaid_account_type as ENUM('depository', 'credit', 'loan', 'investment', 'other');
CREATE TYPE plaid_account_subtype AS ENUM (
    -- depository
    'checking',
    'savings',
    'hsa',
    'cd',
    'money market',
    'paypal',
    'prepaid',
    'cash management',
    'ebt',
    -- credit
    'credit card',
    'line of credit',
    -- loan
    'auto',
    'business',
    'commercial',
    'construction',
    'consumer',
    'home equity',
    'loan',
    'mortgage',
    'student',
    -- investment
    '401a',
    '401k',
    '403B',
    '457b',
    '529',
    'brokerage',
    'ira',
    'roth',
    'roth 401k',
    'sep ira',
    'simple ira',
    'keogh',
    'mutual fund',
    'lira',
    'lrif',
    'lrsp',
    'lif',
    'rlif',
    'rrsp',
    'rrif',
    'sarsep',
    'tfsa',
    'ugma',
    'utma',
    'stock plan',
    'thrift savings plan',
    'variable annuity',
    'fixed annuity',
    'gic',
    'prif',
    'rdsp',
    'resp',
    'isa',
    'education savings account',
    -- payroll
    'payroll',
    -- crypto
    'crypto exchange',
    'non-custodial wallet',
    -- insurance & annuities
    'other annuity',
    'life insurance',
    'other insurance',
    -- miscellaneous
    'non-taxable brokerage account',
    'retirement',
    'trust',
    'cash isa',
    -- catch-alls
    'other'
);
